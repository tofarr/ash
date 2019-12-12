Refractor name of msg/service
Remove concept of transaction breakdown - it should just be a transaction
Remove the concept of hard codes. Instead have transactions match:
receipts_cong, receipts_ww, primary_cong, primary_ww, other_cong, other_ww
Also maybe abandon transaction codes - if it has receipts, then it is a meeting.
If it has receipts out and primary in, it is a deposit.
May need codes for other things.
Introduce polymorphic transactions. (No need for cash / checks for anything besides meetings / deposits)
