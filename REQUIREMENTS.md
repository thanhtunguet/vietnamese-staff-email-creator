# Vietnamese Staff Email Creator

This app helps create staff email addresses from Excel files for Vietnamese enterprise HR departments.

In many Vietnamese companies, there's a common naming convention for staff email addresses: `StaffNameXYZ@example.com`

- StaffName: the staff member's primary name (in most cases, this is the last word in the full name)
- XYZ: the initials of all the other words in the name

For example:
- Pham Thanh Tung => TungPT
- Tran Thanh Thao => ThaoTT
- Le Minh Thanh => ThanhLM

Sometimes, HR departments need to create email addresses in batches. While they can use Excel for this purpose, not all HR professionals have a good template file, and not all of them are proficient with Excel. Additionally, handling Vietnamese names in Excel to remove tone marks is quite challenging.

This app is designed for HR professionals who occasionally need this functionality, making their work easier and more efficient.

Here is the process for converting a Vietnamese name into an email address:

- Remove all tone marks and convert to lowercase
- Put the primary name (last word) first, then add the other words sequentially as initials
- After removing tone marks, there may be name conflicts
- Add an index number to resolve conflicts

For example:

- A staff member named Tran Phuong Thao becomes ThaoTP
- The next person named Ta Phuong Thao would have the same "username": ThaoTP, so they will receive the email address "ThaoTP1"

Finally, we combine the converted name with the company domain to create fully-qualified email addresses: `thaotp@company.com`

# Web UI

- Allow users to upload an Excel file, select the sheet, and choose the column that contains the names
- Include a checkbox labeled "First row is header" to indicate that the first row contains headers (checked by default)
- Process all the names in the selected column
- Add a new column next to the name column containing the username (local part of the email address)
- Generate a new workbook and download it to the user's local computer

The web UI should use Ant Design and Tailwind CSS.

