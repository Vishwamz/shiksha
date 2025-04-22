# **App Name**: Shiksha Hisab

## Core Features:

- Initial Setup: Initial setup wizard to configure the application with school details, admin credentials, and the first financial year.
- Secure Sign-In: Secure user login with financial year selection to ensure data is accessed within the correct fiscal context.
- Account Management: Account Management module to manage Account Groups and individual Accounts with CRUD operations and opening balances per FY.
- Voucher Entry: Voucher Entry module for double-entry bookkeeping with automatic cash balancing and voucher re-numbering based on date within the selected FY.
- Report Generation: Report Generation UI with filtering options to generate essential financial reports in PDF format (Account List, Voucher Report, General Account Ledger, Day Book, Monthly Tarij, Profit and Loss Account, Balance Sheet).

## Style Guidelines:

- Primary color: A calming teal (#4DB6AC) to provide a sense of trust and stability.
- Secondary color: A warm beige (#F5F5DC) to create a welcoming and user-friendly interface.
- Accent: A vibrant orange (#FF8A65) to highlight important actions and calls to action.
- Use a clear and structured layout to ensure that information is easily accessible.
- Employ simple and intuitive icons to enhance user understanding and navigation.
- Incorporate subtle animations to provide feedback and enhance the user experience without being distracting.

## Original User Request:
# Product Requirements Document: School Accounting Software

**Version:** 1.0
**Date:** 2025-04-21

## 1. Introduction

This document outlines the requirements for a desktop School Accounting Software application. The primary goal is to provide a simple, user-friendly tool for managing basic accounting tasks for a school, focusing on account management, voucher entry, and report generation within specific financial years. The primary language for the user interface will be Gujarati.

## 2. Goals

* Provide a secure way to access the application via user login.
* Enable management of Account Groups and individual Accounts (Account Master).
* Facilitate double-entry bookkeeping through a dedicated Voucher Entry module.
* Allow users to work within the context of specific Financial Years.
* Generate essential financial reports in PDF format.
* Offer basic settings management, including password changes and financial year creation.
* Ensure data persistence using a local database.
* Provide a user interface primarily in Gujarati.

## 3. Target Audience

* School administrators or accountants responsible for managing the school's basic financial records.
* Assumes a single user (administrator) model.

## 4. Scope

**In Scope:**

* Initial one-time setup process (Admin User, School Details, First FY).
* User Sign-In with Financial Year selection.
* Account Group Management (CRUD).
* Account Master Management (CRUD) including opening balances per FY.
* Voucher Entry (CRUD) with double-entry validation and automatic cash balancing option.
* Automatic voucher re-numbering based on date within the selected FY.
* Report Generation UI with filtering options.
* Generation of the following reports as PDFs:
    * Account List (ખાતાની યાદી)
    * Voucher Report (વાઉચર રિપોર્ટ)
    * General Account Ledger (સામાન્ય ખાતાવહી)
    * Day Book (રોજમેળ)
    * Monthly Tarij (માસિક સરવાળા)
    * Profit and Loss Account (નફા નુકશાન ખાતુ)
    * Balance Sheet (સરવૈયું)
* Settings Management (View School Details, Create New FY, Change Password).
* "About Us" information display.
* Gujarati language UI elements (labels, buttons, messages).

**Out of Scope:**

* Multi-user support or role-based access control.
* Advanced accounting features (e.g., inventory, payroll, budgeting, depreciation).
* Cloud synchronization or web-based access.
* Complex data import/export features (beyond PDF reports).
* Multiple language support (only Gujarati UI specified).
* Automated backups (user expected to manage the database file).
* Direct integration with banking systems.

## 5. Functional Requirements

### 5.1 Initial Setup

* **FR1.1:** On first launch, the application must guide the user through a mandatory 3-step setup process.
* **FR1.2:** Step 1: Create an administrator account (Username: alphanumeric, lowercase, max 10 chars; Password: 4-digit PIN). Password confirmation required.
* **FR1.3:** Step 2: Enter School Details (Name, Address, Phone, Reg. No., Trust Name, Trust Address). Mandatory fields must be validated.
* **FR1.4:** Step 3: Create the initial Financial Year (auto-calculated based on current date, 01/04 to 31/03 format). User confirms the calculated dates.
* **FR1.5:** Setup data (User, School, FY) is saved only upon successful completion of Step 3.
* **FR1.6:** If setup is interrupted, it must restart from Step 1 on the next launch.
* **FR1.7:** Application must track setup completion status persistently.

### 5.2 Sign-In

* **FR2.1:** Display a Sign-In screen on every launch after initial setup.
* **FR2.2:** Require Username and Password (masked) input.
* **FR2.3:** Provide a dropdown to select the Financial Year (populated from stored FYs, defaulting to the latest).
* **FR2.4:** Authenticate entered credentials against the stored administrator user.
* **FR2.5:** Display an error message (Gujarati) on failed authentication.
* **FR2.6:** On successful authentication, load the main application (Account Page) in the context of the selected Financial Year.
* **FR2.7:** Provide an "Exit" button to close the application.

### 5.3 Main Application Structure

* **FR3.1:** Implement navigation between "Account", "Voucher", and "Report" modules.
* **FR3.2:** Include a vertical three-dot menu icon for accessing "Settings" and "About Us".
* **FR3.3:** All data operations (viewing balances, creating vouchers, generating reports) must be scoped to the Financial Year selected at Sign-In.

### 5.4 Account Management (Account Page)

* **FR4.1:** Provide a dedicated page for managing Account Groups and Accounts.
* **FR4.2 (Account Group):**
    * Allow CRUD operations for Account Groups.
    * Auto-generate unique, sequential Group Codes (non-editable).
    * Require unique Group Name (Gujarati/English).
    * Require Group Type selection ("Primary Group", "Derived Group").
    * Display Account Groups in a scrollable list (sorted by Code).
    * Populate form fields when a group is selected from the list (preview mode).
    * Implement Add New, Edit, Save, Cancel, Delete workflows with appropriate button enabling/disabling.
    * Prevent deletion if Accounts or Vouchers are linked.
* **FR4.3 (Account Master):**
    * Allow CRUD operations for Accounts.
    * Auto-generate unique, sequential Account Codes (non-editable).
    * Require selection of an existing Account Group.
    * Require unique Account Name (Gujarati/English).
    * Require Account Type selection ("વ્યક્તિ/વેપારી ખાતુ", "બેંક ખાતુ", "રોકડ ખાતુ", "અન્ય ખાતુ").
    * Require Account Effect selection ("નફા નુકશાન પત્રકમાં", "સરવૈયામાં").
    * Require Opening Balance (Amount + Debit/Credit type) for the selected FY when creating.
    * Allow optional Address and Phone number entry.
    * Display Accounts in a scrollable list (sorted by Code).
    * Populate form fields with account details (including *current* balance for the selected FY) when an account is selected (preview mode).
    * Implement Add New, Edit, Save, Cancel, Delete workflows.
    * Prevent deletion if Vouchers are linked (across any FY).

### 5.5 Voucher Entry (Voucher Page)

* **FR5.1:** Provide a dedicated page for voucher entry.
* **FR5.2:** Header Fields: Voucher Type (Contra, Journal, Payment, Receipt), Transaction Type (Cash, Bank/Draft), Date (DD/MM/YYYY with picker, validated for FY range and no future date), Voucher Number (auto-generated/assigned on save, sequential per FY based on date).
* **FR5.3:** Implement separate, scrollable sections for Credit (જમા ખાતે) and Debit (ઉધાર ખાતે) entries.
* **FR5.4:** Each entry line must include: Account Name (scrollable dropdown of all accounts), Amount (numeric, 2 decimal places), Details (વિગત, optional multi-line text), Remove button.
* **FR5.5:** Allow adding multiple entry lines per side using "+" buttons.
* **FR5.6:** Display calculated, non-editable balances: Opening Cash Balance (pre-voucher), Closing Cash Balance (post-voucher), Total Credit, Total Debit. Balances must update dynamically during entry.
* **FR5.7:** Implement workflows: Preview (default, showing latest voucher), Add New, Edit, Save, Cancel, Delete (requires PIN confirmation), Copy (prompts for new date, enters Edit mode).
* **FR5.8:** Implement voucher navigation buttons (<<, <, >, >>) based on date/voucher number within the FY.
* **FR5.9 (Save Validation):**
    * Validate header fields and mandatory entry fields.
    * Check if Total Credit equals Total Debit.
    * If unbalanced, prompt user with a dialog to auto-post the difference to a selected Cash Account ('રોકડ ખાતું'). If accepted, add the balancing entry and save. If declined or no cash account exists, return to Edit mode.
* **FR5.10 (Save Logic):**
    * Assign final sequential Voucher Number based on date within the FY.
    * If a saved voucher's date requires it, automatically re-number subsequent vouchers in the FY to maintain chronological sequence.
    * Store voucher header and all valid entry lines in the database, linked to the FY.
* **FR5.11:** Deletion requires administrator PIN confirmation.

### 5.6 Reporting (Report Page)

* **FR6.1:** Provide a dedicated page listing available reports.
* **FR6.2:** For each report, display its name (Gujarati) and a "Create" (બનાવો) button.
* **FR6.3:** Provide specific filter/option controls for each report type (e.g., toggles for Account List, Voucher No. input, Account Name dropdown for Ledger, Date Range pickers for most reports).
* **FR6.4:** All reports must operate on data within the selected Financial Year.
* **FR6.5:** Date range inputs must be validated (valid dates, within FY, not future).
* **FR6.6:** Clicking "Create" must:
    * Validate required filter inputs.
    * Generate the selected report as a PDF document based on the filters.
    * Prompt the user to select a save location and filename for the PDF.
    * Automatically open the generated PDF using the system's default viewer or an integrated previewer (PySide6 suggested).

### 5.7 Settings (Settings Popup)

* **FR7.1:** Provide access to Settings via a modal popup dialog triggered from the 3-dot menu.
* **FR7.2:** Display School Details (read-only).
* **FR7.3:** Provide a button ("Create New Financial Year") that opens a separate dialog.
    * This dialog confirms creation of the next sequential FY.
    * It automatically calculates and saves the new FY dates.
    * It automatically calculates and stores opening balances for the new FY by carrying forward closing balances from the end of the previous FY for all accounts.
* **FR7.4:** Display the administrator Username (read-only).
* **FR7.5:** Provide a button ("Change Password") that opens a separate dialog.
    * This dialog requires current PIN, new PIN (4 digits), and confirmation of new PIN for saving.
* **FR7.6:** Provide access to an "About Us" dialog (content TBD) from the 3-dot menu.

## 6. Non-Functional Requirements

* **NFR2 (Language):** All user-facing text (labels, buttons, messages, report titles) must be in Gujarati. Internal identifiers or dropdown *values* can be English where specified (e.g., Voucher Type).
* **NFR3 (Database):** Data must be stored persistently in a local SQLite database file.
* **NFR4 (Usability):** The application should be intuitive and easy to use for the target audience. Navigation should be clear. Scrollable lists must be provided for potentially long lists (Account Groups, Accounts, Voucher Entries).
* **NFR5 (Error Handling):** Provide clear, user-friendly error messages (in Gujarati) for validation errors, database issues, or prevented actions (e.g., deleting linked items).
* **NFR6 (Performance):** The application should respond reasonably quickly for typical operations (data entry, navigation, basic report generation). Performance with very large datasets is not a primary focus.
* **NFR7 (Platform):** The application should run on Windows desktop environments where Python and required libraries can be installed.

## 7. Data Model (High-Level)

* **Users:** Stores admin username and password (PIN).
* **SchoolDetails:** Stores school name, address, phone, reg no, trust name, trust address.
* **FinancialYears:** Stores FY start date, end date, identifier (e.g., "2025-2026").
* **AppSettings:** Stores setup completion status.
* **AccountGroups:** Stores group code (PK), name, type.
* **Accounts:** Stores account code (PK), name, group code (FK), type, effect, address, phone.
* **AccountBalances:** Stores account code (FK), financial year ID (FK), opening balance amount, opening balance type (Dr/Cr). (Note: Current balance is calculated dynamically).
* **Vouchers:** Stores voucher ID (PK, unique per FY), voucher number (sequential per FY), date, voucher type, transaction type, financial year ID (FK).
* **VoucherEntries:** Stores entry ID (PK), voucher ID (FK), account code (FK), side (Credit/Debit), amount, details (વિગત).

---
  