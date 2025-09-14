# Vietnamese Staff Email Creator

This app helps creating staff's email addresses from Excel files for Vietnamese entreprise HRs

In many Vietnames companies, there's a common naming convention for staff's email addresses: `StaffNameXYZ@example.com`

- StaffName: staff's primary name (in most cases it is final word in the fullname)
- XYZ: the initialism of all the other words in the name.

For example:
- Pham Thanh Tung => TungPT
- Tran Thanh Thao => ThaoTT
- Le Minh Thanh => ThanhLM

Sometimes, HR have to create email addresses in batches. They can use Excel...
However, not all the HRs have a good template file, not all of them is good at Excel. Besides, Handling Vietnamese name in Excel to remove tone marks is really hard.

So this app is made for them, the ones who need them sometimes, to make their life easier.

This is the process of converting a Vietnamese name into email address:

- Remove all tone marks, lowercase them
- Put the name (last word) first then put the other words sequently.
- After removed the tone marks, there may be few names conflict.
- We add the index to the name.

For example:

- There's a staff with name Tran Phuong Thao => ThaoTP
- The next person with name Ta Phuong Thao will have the same "username": ThaoTP, so she will have email address "ThaoTP1"

Then we combine the converted name with company domain to have full-qualified email addresses: `thaotp@company.com`

# Web UI

- Let users upload Excel file, select the sheet and the column that contains the name.
- A checkbox "First row is header" to indicate that first row is header, checked by default
- Process all the names.
- Add a column next to the name column with the username (local part of email address)
- Build new workbook and download it to local computer.

Web UI should use Ant.design and tailwindCSS.

