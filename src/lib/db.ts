import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path'; // Needed for Electron environment to locate db file

const DB_FILE_NAME = 'appdata.db';

// Determine database path based on environment (Electron vs. standard Node)
// In Electron, app.getPath('userData') is the preferred location for user data.
// This script will run in Electron's main or renderer process context.
// For simplicity in this subtask, we'll assume it can write to the app's root during dev,
// but for production, userData path is better.
const dbPath = process.env.NODE_ENV === 'development'
                ? DB_FILE_NAME
                : path.join(window.require('electron').remote.app.getPath('userData'), DB_FILE_NAME);
                // Note: Using window.require for Electron modules in renderer if not using contextBridge/preload.
                // If this db.ts is intended for main process, remote is not needed.
                // For now, this structure assumes renderer context or a setup where electron modules are accessible.

let db: Database | null = null;

export async function getDbConnection() {
    if (db) return db;
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        console.log('Connected to the SQLite database.');
        await initializeDbSchema(db);
        return db;
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        throw err;
    }
}

async function initializeDbSchema(dbInstance: Database) {
    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS account_groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code INTEGER UNIQUE,
            name TEXT UNIQUE NOT NULL,
            type TEXT -- 'Primary Group', 'Derived Group'
        );

        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code INTEGER UNIQUE,
            group_name TEXT NOT NULL, -- Should reference account_groups(name)
            name TEXT UNIQUE NOT NULL,
            type TEXT, -- 'રોકડ ખાતુ', 'બેંક ખાતુ', etc.
            effect TEXT, -- 'નફા નુકશાન પત્રકમાં', 'સરવૈયામાં'
            opening_balance REAL DEFAULT 0,
            address TEXT,
            phone TEXT,
            FOREIGN KEY (group_name) REFERENCES account_groups(name) ON DELETE RESTRICT ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS vouchers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            voucher_number TEXT UNIQUE NOT NULL, -- Auto-generated or manually entered if allowed
            voucher_type TEXT NOT NULL, -- 'Contra', 'Journal', 'Payment', 'Receipt'
            transaction_type TEXT, -- 'Cash', 'Bank/Draft'
            date TEXT NOT NULL, -- Store as ISO string (YYYY-MM-DD HH:MM:SS.SSS)
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS voucher_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            voucher_id INTEGER NOT NULL,
            entry_type TEXT NOT NULL, -- 'credit' or 'debit'
            account_name TEXT NOT NULL, -- References accounts(name)
            amount REAL NOT NULL,
            details TEXT,
            FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
            FOREIGN KEY (account_name) REFERENCES accounts(name) ON DELETE RESTRICT ON UPDATE CASCADE
            -- Note: Using account_name as FK. Ensure account names are unique or use account_id.
            -- For simplicity with current structure, using name.
        );
    `);
    console.log('Database schema initialized.');
}

// --- Account Groups CRUD ---
export async function getAllAccountGroups() {
    const db = await getDbConnection();
    return db.all('SELECT * FROM account_groups ORDER BY code');
}

export async function addAccountGroup(group: { name: string; type: string; code: number }) {
    const db = await getDbConnection();
    const result = await db.run('INSERT INTO account_groups (name, type, code) VALUES (?, ?, ?)', [group.name, group.type, group.code]);
    return { id: result.lastID, ...group };
}

export async function updateAccountGroup(id: number, group: { name: string; type: string }) {
    const db = await getDbConnection();
    await db.run('UPDATE account_groups SET name = ?, type = ? WHERE id = ?', [group.name, group.type, id]);
    return { id, ...group };
}

export async function deleteAccountGroup(id: number) {
    const db = await getDbConnection();
    // Check if any accounts are linked to this group
    const count = await db.get('SELECT COUNT(*) as count FROM accounts WHERE group_name = (SELECT name FROM account_groups WHERE id = ?)', [id]);
    if (count && count.count > 0) {
        throw new Error('Cannot delete group: Accounts are linked to it.');
    }
    await db.run('DELETE FROM account_groups WHERE id = ?', [id]);
    return { id };
}

export async function getNextAccountGroupCode() {
    const db = await getDbConnection();
    const result = await db.get("SELECT MAX(code) as max_code FROM account_groups");
    return (result?.max_code || 0) + 1;
}

// --- Accounts CRUD ---
export async function getAllAccounts() {
    const db = await getDbConnection();
    return db.all('SELECT * FROM accounts ORDER BY code');
}

export async function addAccount(account: any) { // Add proper type for account
    const db = await getDbConnection();
    const { group_name, name, type, effect, opening_balance, address, phone, code } = account;
    const result = await db.run(
        'INSERT INTO accounts (group_name, name, type, effect, opening_balance, address, phone, code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [group_name, name, type, effect, parseFloat(opening_balance) || 0, address, phone, code]
    );
    return { id: result.lastID, ...account };
}

export async function updateAccount(id: number, account: any) { // Add proper type for account
     const db = await getDbConnection();
     const { group_name, name, type, effect, opening_balance, address, phone } = account;
     await db.run(
         'UPDATE accounts SET group_name = ?, name = ?, type = ?, effect = ?, opening_balance = ?, address = ?, phone = ? WHERE id = ?',
         [group_name, name, type, effect, parseFloat(opening_balance) || 0, address, phone, id]
     );
     return {id, ...account};
}

export async function deleteAccount(id: number) {
     const db = await getDbConnection();
     // Add check for linked vouchers if necessary in the future
     await db.run('DELETE FROM accounts WHERE id = ?', [id]);
     return {id};
}

export async function getNextAccountCode() {
     const db = await getDbConnection();
     const result = await db.get("SELECT MAX(code) as max_code FROM accounts");
     return (result?.max_code || 0) + 1;
}

// --- Vouchers CRUD ---

// Get next voucher number (example: VCH-0001)
export async function getNextVoucherNumber() {
    const db = await getDbConnection();
    const result = await db.get("SELECT MAX(CAST(SUBSTR(voucher_number, 5) AS INTEGER)) as max_num FROM vouchers WHERE voucher_number LIKE 'VCH-%'");
    const nextNum = (result?.max_num || 0) + 1;
    return `VCH-${String(nextNum).padStart(4, '0')}`;
}

export async function addVoucher(voucherData: { voucher_type: string; transaction_type: string; date: string; creditEntries: any[]; debitEntries: any[]; voucher_number: string }) {
    const db = await getDbConnection();
    await db.run('BEGIN TRANSACTION');
    try {
        const result = await db.run(
            'INSERT INTO vouchers (voucher_number, voucher_type, transaction_type, date) VALUES (?, ?, ?, ?)',
            [voucherData.voucher_number, voucherData.voucher_type, voucherData.transaction_type, voucherData.date]
        );
        const voucherId = result.lastID;
        if (!voucherId) throw new Error("Failed to create voucher header.");

        for (const entry of voucherData.creditEntries) {
            if (entry.account && entry.amount) { // Ensure entry is valid
                await db.run('INSERT INTO voucher_entries (voucher_id, entry_type, account_name, amount, details) VALUES (?, ?, ?, ?, ?)',
                    [voucherId, 'credit', entry.account, parseFloat(entry.amount) || 0, entry.details]
                );
            }
        }
        for (const entry of voucherData.debitEntries) {
             if (entry.account && entry.amount) { // Ensure entry is valid
                await db.run('INSERT INTO voucher_entries (voucher_id, entry_type, account_name, amount, details) VALUES (?, ?, ?, ?, ?)',
                    [voucherId, 'debit', entry.account, parseFloat(entry.amount) || 0, entry.details]
                );
             }
        }
        await db.run('COMMIT');
        return { id: voucherId, ...voucherData };
    } catch (error) {
        await db.run('ROLLBACK');
        console.error("Failed to add voucher:", error);
        throw error;
    }
}

export async function getVoucherById(id: number) {
    const db = await getDbConnection();
    const voucher = await db.get('SELECT * FROM vouchers WHERE id = ?', [id]);
    if (!voucher) return null;
    const creditEntries = await db.all('SELECT * FROM voucher_entries WHERE voucher_id = ? AND entry_type = "credit"', [id]);
    const debitEntries = await db.all('SELECT * FROM voucher_entries WHERE voucher_id = ? AND entry_type = "debit"', [id]);
    return { ...voucher, creditEntries, debitEntries };
}

export async function getAllVouchers(limit = 10, offset = 0) { // Basic pagination
     const db = await getDbConnection();
     const vouchers = await db.all('SELECT * FROM vouchers ORDER BY date DESC, id DESC LIMIT ? OFFSET ?', [limit, offset]);
     const totalCount = await db.get('SELECT COUNT(*) as count FROM vouchers');
     return { vouchers, totalCount: totalCount?.count || 0 };
}

export async function updateVoucher(voucherId: number, voucherData: { voucher_type: string; transaction_type: string; date: string; creditEntries: any[]; debitEntries: any[] }) {
     const db = await getDbConnection();
     await db.run('BEGIN TRANSACTION');
     try {
         await db.run(
             'UPDATE vouchers SET voucher_type = ?, transaction_type = ?, date = ? WHERE id = ?',
             [voucherData.voucher_type, voucherData.transaction_type, voucherData.date, voucherId]
         );

         // Simple approach: delete old entries, add new ones
         await db.run('DELETE FROM voucher_entries WHERE voucher_id = ?', [voucherId]);

         for (const entry of voucherData.creditEntries) {
              if (entry.account && entry.amount) {
                 await db.run('INSERT INTO voucher_entries (voucher_id, entry_type, account_name, amount, details) VALUES (?, ?, ?, ?, ?)',
                     [voucherId, 'credit', entry.account, parseFloat(entry.amount) || 0, entry.details]);
              }
         }
         for (const entry of voucherData.debitEntries) {
              if (entry.account && entry.amount) {
                 await db.run('INSERT INTO voucher_entries (voucher_id, entry_type, account_name, amount, details) VALUES (?, ?, ?, ?, ?)',
                     [voucherId, 'debit', entry.account, parseFloat(entry.amount) || 0, entry.details]);
              }
         }
         await db.run('COMMIT');
         return { id: voucherId, ...voucherData };
     } catch (error) {
         await db.run('ROLLBACK');
         console.error("Failed to update voucher:", error);
         throw error;
     }
}

export async function deleteVoucher(voucherId: number) {
    const db = await getDbConnection();
    // ON DELETE CASCADE will handle voucher_entries
    const result = await db.run('DELETE FROM vouchers WHERE id = ?', [voucherId]);
    if (result.changes === 0) throw new Error("Voucher not found or already deleted.");
    return { id: voucherId };
}

// Add functions for voucher navigation (first, prev, next, last)
 export async function getFirstVoucherId() {
     const db = await getDbConnection();
     const result = await db.get('SELECT id FROM vouchers ORDER BY date ASC, id ASC LIMIT 1');
     return result?.id || null;
 }
 export async function getLastVoucherId() {
     const db = await getDbConnection();
     const result = await db.get('SELECT id FROM vouchers ORDER BY date DESC, id DESC LIMIT 1');
     return result?.id || null;
 }
 export async function getPreviousVoucherId(currentDate: string, currentId: number) {
     const db = await getDbConnection();
     // Convert currentDate (which is likely a string from the voucher) to a format suitable for comparison if needed
     // For simplicity, assuming date strings are comparable directly or stored as ISO strings.
     const result = await db.get(
         "SELECT id FROM vouchers WHERE (date < ? OR (date = ? AND id < ?)) ORDER BY date DESC, id DESC LIMIT 1",
         [currentDate, currentDate, currentId]
     );
     return result?.id || null;
 }

// --- Report Helper Functions ---

// For Account List Report
export async function getAccountListReport(includeGroupName: boolean, includeAddress: boolean) {
    const db = await getDbConnection();
    let query = "SELECT a.code as account_code, a.name as account_name";
    if (includeGroupName) query += ", a.group_name";
    if (includeAddress) query += ", a.address";
    query += " FROM accounts a ORDER BY a.code";
    return db.all(query);
}

// For Voucher Report (by voucher_number)
export async function getVoucherByVoucherNumber(voucherNumber: string) {
    const db = await getDbConnection();
    const voucher = await db.get('SELECT * FROM vouchers WHERE voucher_number = ?', [voucherNumber]);
    if (!voucher) return null;
    const creditEntries = await db.all('SELECT * FROM voucher_entries WHERE voucher_id = ? AND entry_type = "credit"', [voucher.id]);
    const debitEntries = await db.all('SELECT * FROM voucher_entries WHERE voucher_id = ? AND entry_type = "debit"', [voucher.id]);
    return { ...voucher, creditEntries, debitEntries };
}

// For General Account Ledger Report
export async function getGeneralLedger(accountName: string, fromDate: string, toDate: string) {
    const db = await getDbConnection();
    // This is a simplified ledger. A real one needs opening balance calculation.
    // For opening balance: SUM(amount) for entries before fromDate for this account.
    const openingBalanceCredit = await db.get(
        `SELECT SUM(ve.amount) as total FROM voucher_entries ve
         JOIN vouchers v ON ve.voucher_id = v.id
         WHERE ve.account_name = ? AND v.date < ? AND ve.entry_type = 'credit'`,
        [accountName, fromDate]
    );
    const openingBalanceDebit = await db.get(
        `SELECT SUM(ve.amount) as total FROM voucher_entries ve
         JOIN vouchers v ON ve.voucher_id = v.id
         WHERE ve.account_name = ? AND v.date < ? AND ve.entry_type = 'debit'`,
        [accountName, fromDate]
    );

    const obCredit = openingBalanceCredit?.total || 0;
    const obDebit = openingBalanceDebit?.total || 0;
    // This simple calculation might need to consider if the account is an asset/liability/income/expense
    // for correct sign of opening balance. Assuming direct debit/credit totals for now.
    const openingBalance = obDebit - obCredit; // Example: Assets/Expenses have debit balance

    const entries = await db.all(
        `SELECT v.date, v.voucher_number, v.voucher_type, ve.entry_type, ve.amount, ve.details
         FROM voucher_entries ve
         JOIN vouchers v ON ve.voucher_id = v.id
         WHERE ve.account_name = ? AND v.date >= ? AND v.date <= ?
         ORDER BY v.date, v.id`,
        [accountName, fromDate, toDate]
    );
    return { openingBalance, entries };
}

// For Day Book Report
export async function getDayBook(fromDate: string, toDate: string) {
    const db = await getDbConnection();
    // Fetches all entries and groups them by voucher for display
    const vouchers = await db.all(
        `SELECT * FROM vouchers
         WHERE date >= ? AND date <= ?
         ORDER BY date, id`,
        [fromDate, toDate]
    );

    const dayBookEntries = [];
    for (const voucher of vouchers) {
        const entries = await db.all('SELECT * FROM voucher_entries WHERE voucher_id = ?', [voucher.id]);
        dayBookEntries.push({ ...voucher, entries });
    }
    return dayBookEntries;
}

// Placeholder for Monthly Tarij (Trial Balance) - Complex: requires summing up all account balances
export async function getMonthlyTarij(fromDate: string, toDate: string) {
    console.warn("getMonthlyTarij is a placeholder and needs full implementation.");
    // Basic idea: Iterate all accounts, calculate their closing balance as of toDate (considering opening balance and transactions in range)
    return {
        message: "Monthly Tarij / Trial Balance report needs full implementation for balance calculations.",
        data: []
    };
}

// Placeholder for Profit & Loss - Complex
export async function getProfitLoss(fromDate: string, toDate: string) {
    console.warn("getProfitLoss is a placeholder and needs full implementation.");
    // Basic idea: Fetch all accounts with effect 'નફા નુકશાન પત્રકમાં'. Calculate their net change in balance during the period.
    return {
        message: "Profit & Loss report needs full implementation.",
        data: []
    };
}

// Placeholder for Balance Sheet - Complex
export async function getBalanceSheet(asOnDate: string) {
    console.warn("getBalanceSheet is a placeholder and needs full implementation.");
    // Basic idea: Fetch all accounts with effect 'સરવૈયામાં'. Calculate their closing balance as of asOnDate.
    return {
        message: "Balance Sheet report needs full implementation.",
        data: []
    };
}
 export async function getNextVoucherId(currentDate: string, currentId: number) {
     const db = await getDbConnection();
     const result = await db.get(
         "SELECT id FROM vouchers WHERE (date > ? OR (date = ? AND id > ?)) ORDER BY date ASC, id ASC LIMIT 1",
         [currentDate, currentDate, currentId]
     );
     return result?.id || null;
 }
