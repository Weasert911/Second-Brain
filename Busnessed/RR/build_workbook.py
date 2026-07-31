import os
from datetime import date
import xlsxwriter

OUT = "Womens_Clothing_Reselling_Business.xlsx"
wb = xlsxwriter.Workbook(OUT)
wb.set_properties({
    "title": "Women's Clothing Reselling & Dropshipping Business Workbook",
    "subject": "Orders, products, expenses, customers, returns and dashboard",
    "author": "OpenCode",
    "comments": "Beginner-friendly operating workbook with formulas and sample data."
})

# Palette
NAVY = "#293241"
TEAL = "#5B9A9A"
TEAL_DARK = "#397B7B"
SAGE = "#DDEDE7"
PEACH = "#FBE3D5"
LAVENDER = "#E9E4F0"
YELLOW = "#FFF2CC"
BLUE = "#DDEBF7"
RED = "#F4CCCC"
GREEN = "#D9EAD3"
INK = "#36454F"
WHITE = "#FFFFFF"

fmt = {}
fmt["title"] = wb.add_format({"bold": True, "font_size": 20, "font_color": WHITE, "bg_color": NAVY, "align": "left", "valign": "vcenter"})
fmt["subtitle"] = wb.add_format({"italic": True, "font_color": "#5C6770", "bg_color": "#F4F7F8", "text_wrap": True, "valign": "vcenter"})
fmt["header"] = wb.add_format({"bold": True, "font_color": WHITE, "bg_color": TEAL_DARK, "border": 0, "align": "center", "valign": "vcenter", "text_wrap": True})
fmt["section"] = wb.add_format({"bold": True, "font_size": 12, "font_color": NAVY, "bg_color": SAGE, "border": 0})
fmt["label"] = wb.add_format({"bold": True, "font_color": INK, "bg_color": "#F4F7F8"})
fmt["text"] = wb.add_format({"font_color": INK, "bg_color": WHITE})
fmt["date"] = wb.add_format({"num_format": "dd-mmm-yyyy", "font_color": INK})
fmt["currency"] = wb.add_format({"num_format": '₹#,##0.00;[Red]-₹#,##0.00', "font_color": INK})
fmt["currency_bold"] = wb.add_format({"bold": True, "font_size": 14, "num_format": '₹#,##0.00;[Red]-₹#,##0.00', "font_color": NAVY, "bg_color": SAGE})
fmt["number"] = wb.add_format({"num_format": "#,##0", "font_color": INK})
fmt["number_bold"] = wb.add_format({"bold": True, "font_size": 14, "num_format": "#,##0", "font_color": NAVY, "bg_color": SAGE})
fmt["note"] = wb.add_format({"font_color": "#63707A", "italic": True, "text_wrap": True})
fmt["formula"] = wb.add_format({"num_format": '₹#,##0.00;[Red]-₹#,##0.00', "bg_color": "#F3F8F6", "font_color": INK})
fmt["formula_num"] = wb.add_format({"num_format": "#,##0", "bg_color": "#F3F8F6", "font_color": INK})
fmt["formula_text"] = wb.add_format({"bg_color": "#F3F8F6", "font_color": INK})
fmt["month"] = wb.add_format({"num_format": "mmm-yy", "font_color": INK})

lists = wb.add_worksheet("Lists")
list_values = {
    "Categories": ["Dresses", "Tops", "Bottoms", "Co-ords", "Kurtis", "Sarees", "Activewear", "Accessories"],
    "Suppliers": ["Meesho", "Local Wholesaler", "Other"],
    "Payment Status": ["Paid", "Pending", "Refunded"],
    "Order Status": ["Pending", "Shipped", "Delivered", "Cancelled"],
    "Payment Methods": ["UPI", "Cash on Delivery", "Bank Transfer", "Card", "Wallet"],
    "Product Status": ["Active", "Inactive"],
    "Return Status": ["Requested", "Approved", "Received", "Refunded", "Rejected"],
}
list_ranges = {}
for col, (name, vals) in enumerate(list_values.items()):
    lists.write(0, col, name, fmt["header"])
    for row, val in enumerate(vals, 1):
        lists.write(row, col, val, fmt["text"])
    col_letter = xlsxwriter.utility.xl_col_to_name(col)
    list_ranges[name] = f"=Lists!${col_letter}$2:${col_letter}${len(vals)+1}"
lists.hide()

def setup(ws, title, subtitle, widths):
    ws.hide_gridlines(2)
    ws.set_tab_color(TEAL)
    ws.set_row(0, 30)
    ws.merge_range(0, 0, 0, len(widths)-1, title, fmt["title"])
    ws.merge_range(1, 0, 1, len(widths)-1, subtitle, fmt["subtitle"])
    for col, width in enumerate(widths): ws.set_column(col, col, width)

def add_table(ws, start_row, headers, rows, table_name, col_formats=None, formula_cols=None, validations=None):
    data = []
    for r in rows: data.append(r)
    # Pre-size to 100 input rows so formulas and filters are ready to use.
    capacity = max(100, len(data))
    for _ in range(capacity - len(data)): data.append([None] * len(headers))
    columns = [{"header": h} for h in headers]
    if col_formats:
        for i, f in col_formats.items(): columns[i]["format"] = f
    if formula_cols:
        for i, f in formula_cols.items(): columns[i]["formula"] = f
    ws.add_table(start_row, 0, start_row + capacity, len(headers)-1, {"name": table_name, "style": "Table Style Medium 4", "columns": columns, "data": data, "autofilter": True})
    ws.freeze_panes(start_row + 1, 0)
    if validations:
        for col, source in validations.items():
            ws.data_validation(start_row + 1, col, start_row + capacity, col, {"validate": "list", "source": source, "input_title": "Choose from list", "error_title": "Invalid choice", "error_message": "Please select a value from the dropdown."})
    return start_row + capacity

# Orders
orders = wb.add_worksheet("Orders")
order_headers = ["Order ID","Date","Customer Name","Phone Number","Instagram Username","City","State","Pincode","Product Name","Category","Size","Color","Supplier (Meesho)","Supplier Price","Selling Price","Shipping Cost","Payment Method","Payment Status","Order Status","Tracking Number","Delivery Date","Profit","Notes"]
order_rows = [
 ["ORD-1001",date(2026,1,8),"Aaravya Singh","9876543210","@aaravya.style","Mumbai","Maharashtra","400001","Floral Wrap Dress","Dresses","M","Pink","Meesho",650,1199,80,"UPI","Paid","Delivered","TRK-MH-001",date(2026,1,14),None,"Repeat buyer"],
 ["ORD-1002",date(2026,1,21),"Diya Sharma","9876543211","@diyasharma","Pune","Maharashtra","411001","Ribbed Knit Top","Tops","S","Black","Meesho",350,799,70,"Cash on Delivery","Pending","Pending",None,None,None,"Confirm size before shipping"],
 ["ORD-1003",date(2026,2,5),"Meera Patel","9876543212","@meerawears","Ahmedabad","Gujarat","380001","Wide Leg Trousers","Bottoms","L","Beige","Meesho",550,1099,85,"UPI","Paid","Shipped","TRK-GJ-003",None,None,""],
 ["ORD-1004",date(2026,2,18),"Kavya Nair","9876543213","@kavya.nair","Kochi","Kerala","682001","Cotton Co-ord Set","Co-ords","M","Sage","Local Wholesaler",900,1599,95,"Card","Paid","Delivered","TRK-KL-004",date(2026,2,25),None,""],
 ["ORD-1005",date(2026,3,2),"Riya Gupta","9876543214","@riya.g","Delhi","Delhi","110001","Printed Anarkali Kurti","Kurtis","XL","Blue","Meesho",480,999,75,"UPI","Paid","Delivered","TRK-DL-005",date(2026,3,9),None,""],
 ["ORD-1006",date(2026,3,19),"Nisha Verma","9876543215","@nishav","Jaipur","Rajasthan","302001","Satin Party Dress","Dresses","S","Maroon","Meesho",720,1399,85,"Cash on Delivery","Pending","Cancelled",None,None,None,"Customer cancelled"],
 ["ORD-1007",date(2026,4,7),"Aaravya Singh","9876543210","@aaravya.style","Mumbai","Maharashtra","400001","Linen Shirt Dress","Dresses","M","White","Meesho",700,1299,80,"UPI","Paid","Delivered","TRK-MH-007",date(2026,4,13),None,"Repeat customer"],
 ["ORD-1008",date(2026,4,23),"Ananya Rao","9876543216","@ananyarao","Bengaluru","Karnataka","560001","Yoga Leggings","Activewear","M","Olive","Meesho",400,899,70,"Wallet","Paid","Shipped","TRK-KA-008",None,None,""],
 ["ORD-1009",date(2026,5,11),"Sana Khan","9876543217","@sana.khan","Lucknow","Uttar Pradesh","226001","Chiffon Saree","Sarees","Free","Lavender","Meesho",850,1499,90,"Bank Transfer","Paid","Delivered","TRK-UP-009",date(2026,5,18),None,""],
 ["ORD-1010",date(2026,5,26),"Pooja Iyer","9876543218","@pooja.iyer","Chennai","Tamil Nadu","600001","Basic Cotton Tee","Tops","L","White","Meesho",220,599,65,"UPI","Paid","Delivered","TRK-TN-010",date(2026,6,2),None,""],
 ["ORD-1011",date(2026,6,9),"Tara Joshi","9876543219","@tarajoshi","Nashik","Maharashtra","422001","Pleated Palazzo Pants","Bottoms","M","Navy","Meesho",430,949,75,"Cash on Delivery","Pending","Pending",None,None,None,""],
 ["ORD-1012",date(2026,6,24),"Kritika Sen","9876543220","@kritikasen","Kolkata","West Bengal","700001","Embroidered Kurti","Kurtis","L","Peach","Local Wholesaler",600,1199,80,"UPI","Paid","Delivered","TRK-WB-012",date(2026,7,1),None,""],
]
setup(orders, "Orders", "Enter one order per row. Blue/green/yellow/red status fills make follow-up easy. Profit = Selling Price - Supplier Price - Shipping Cost.", [14,13,20,15,20,14,18,10,24,14,10,14,18,14,14,13,18,15,15,18,14,14,27])
end = add_table(orders, 3, order_headers, order_rows, "OrdersTable", {1:fmt["date"],13:fmt["currency"],14:fmt["currency"],15:fmt["currency"],20:fmt["date"],21:fmt["formula"]}, {21:'=IF([@[Order ID]]="","",[@[Selling Price]]-[@[Supplier Price]]-[@[Shipping Cost]])'}, {9:list_ranges["Categories"],12:list_ranges["Suppliers"],16:list_ranges["Payment Methods"],17:list_ranges["Payment Status"],18:list_ranges["Order Status"]})
for status, color in [("Delivered",GREEN),("Pending",YELLOW),("Shipped",BLUE),("Cancelled",RED)]: orders.conditional_format(4,18,end,18,{"type":"text","criteria":"containing","value":status,"format":wb.add_format({"bg_color":color,"font_color":INK})})

# Products
products = wb.add_worksheet("Products")
product_headers = ["Product ID","Product Name","Category","Supplier","Supplier Link","Supplier Cost","Selling Price","Profit","Available Sizes","Available Colors","Fabric","Product Status (Active/Inactive)"]
product_rows = [["P-001","Floral Wrap Dress","Dresses","Meesho","https://www.meesho.com/",650,1199,None,"S, M, L, XL","Pink, Blue","Rayon","Active"],["P-002","Ribbed Knit Top","Tops","Meesho","https://www.meesho.com/",350,799,None,"S, M, L","Black, White, Beige","Cotton Blend","Active"],["P-003","Wide Leg Trousers","Bottoms","Meesho","https://www.meesho.com/",550,1099,None,"M, L, XL","Beige, Black","Polyester","Active"],["P-004","Cotton Co-ord Set","Co-ords","Local Wholesaler","",900,1599,None,"S, M, L","Sage, Cream","Cotton","Active"],["P-005","Satin Party Dress","Dresses","Meesho","https://www.meesho.com/",720,1399,None,"S, M, L","Maroon, Navy","Satin","Inactive"]]
setup(products, "Products", "Maintain your catalog here. Add new products below the sample rows; Profit calculates automatically.", [14,25,15,20,32,14,14,14,20,24,17,28])
pend = add_table(products,3,product_headers,product_rows,"ProductsTable",{5:fmt["currency"],6:fmt["currency"],7:fmt["formula"]},{7:'=IF([@[Product ID]]="","",[@[Selling Price]]-[@[Supplier Cost]])'},{2:list_ranges["Categories"],3:list_ranges["Suppliers"],11:list_ranges["Product Status"]})

# Expenses
expenses = wb.add_worksheet("Expenses")
expense_headers = ["Date","Expense Category","Description","Amount","Payment Method"]
expense_rows = [[date(2026,1,5),"Marketing","Instagram boosted post",500,"UPI"],[date(2026,2,12),"Packaging","Courier bags and thank-you cards",350,"UPI"],[date(2026,3,15),"Tools","Order tracking app",299,"Card"],[date(2026,4,3),"Marketing","Influencer sample delivery",650,"Bank Transfer"],[date(2026,5,20),"Other","Phone and data recharge",499,"UPI"]]
setup(expenses,"Expenses","Track business costs outside individual order shipping. Total Expenses below updates automatically.",[14,20,35,15,20])
eend=add_table(expenses,3,expense_headers,expense_rows,"ExpensesTable",{0:fmt["date"],3:fmt["currency"]},{},{4:list_ranges["Payment Methods"]})
expenses.write(eend+2,0,"Total Expenses",fmt["label"]); expenses.write_formula(eend+2,3,"=SUM(ExpensesTable[Amount])",fmt["currency_bold"],2298)

# Customers
customers = wb.add_worksheet("Customers")
customer_headers=["Customer Name","Phone","Instagram ID","First Order Date","Last Order Date","Total Orders","Total Spent","Total Profit","Repeat Customer (Yes/No)"]
customer_rows=[["Aaravya Singh","9876543210","@aaravya.style",None,None,None,None,None,None],["Diya Sharma","9876543211","@diyasharma",None,None,None,None,None,None],["Meera Patel","9876543212","@meerawears",None,None,None,None,None,None],["Kavya Nair","9876543213","@kavya.nair",None,None,None,None,None,None],["Riya Gupta","9876543214","@riya.g",None,None,None,None,None,None],["Ananya Rao","9876543216","@ananyarao",None,None,None,None,None,None]]
setup(customers,"Customers","Customer metrics are calculated from Orders using the phone number as the matching key.",[22,16,22,16,16,14,16,16,23])
customer_formulas={3:'=IF([@Phone]="","",IFERROR(MINIFS(OrdersTable[Date],OrdersTable[Phone Number],[@Phone]),""))',4:'=IF([@Phone]="","",IFERROR(MAXIFS(OrdersTable[Date],OrdersTable[Phone Number],[@Phone]),""))',5:'=IF([@Phone]="","",COUNTIF(OrdersTable[Phone Number],[@Phone]))',6:'=IF([@Phone]="","",SUMIF(OrdersTable[Phone Number],[@Phone],OrdersTable[Selling Price]))',7:'=IF([@Phone]="","",SUMIF(OrdersTable[Phone Number],[@Phone],OrdersTable[Profit]))',8:'=IF([@Phone]="","",IF([@[Total Orders]]>1,"Yes","No"))'}
cend=add_table(customers,3,customer_headers,customer_rows,"CustomersTable",{3:fmt["date"],4:fmt["date"],5:fmt["formula_num"],6:fmt["currency"],7:fmt["currency"]},customer_formulas)

# Returns
returns=wb.add_worksheet("Returns & Refunds")
return_headers=["Order ID","Customer","Product","Reason","Refund Amount","Return Status","Date"]
return_rows=[["ORD-1003","Meera Patel","Wide Leg Trousers","Size issue",1099,"Requested",date(2026,2,28)],["ORD-1005","Riya Gupta","Printed Anarkali Kurti","Color preference",999,"Refunded",date(2026,3,18)]]
setup(returns,"Returns & Refunds","Record returns separately so refund exposure is visible without changing the original order history.",[15,22,25,25,16,18,14])

# Monthly Sales
monthly=wb.add_worksheet("Monthly Sales")
monthly_headers=["Month","Orders","Revenue","Cost","Profit","Expenses","Net Profit"]
setup(monthly,"Monthly Sales","This summary uses order dates. Net Profit = order profit - business expenses; refunds are shown on the Returns & Refunds sheet.",[16,14,16,16,16,16,16])
months=[date(2026,m,1) for m in range(1,13)]
monthly_rows=[[m,None,None,None,None,None,None] for m in months]
monthly_formulas={1:'=COUNTIFS(OrdersTable[Date],">="&[@Month],OrdersTable[Date],"<"&EDATE([@Month],1))',2:'=SUMIFS(OrdersTable[Selling Price],OrdersTable[Date],">="&[@Month],OrdersTable[Date],"<"&EDATE([@Month],1))',3:'=SUMIFS(OrdersTable[Supplier Price],OrdersTable[Date],">="&[@Month],OrdersTable[Date],"<"&EDATE([@Month],1))+SUMIFS(OrdersTable[Shipping Cost],OrdersTable[Date],">="&[@Month],OrdersTable[Date],"<"&EDATE([@Month],1))',4:'=SUMIFS(OrdersTable[Profit],OrdersTable[Date],">="&[@Month],OrdersTable[Date],"<"&EDATE([@Month],1))',5:'=SUMIFS(ExpensesTable[Amount],ExpensesTable[Date],">="&[@Month],ExpensesTable[Date],"<"&EDATE([@Month],1))',6:'=[@Profit]-[@Expenses]'}
mend=add_table(monthly,3,monthly_headers,monthly_rows,"MonthlySalesTable",{0:fmt["month"],1:fmt["formula_num"],2:fmt["currency"],3:fmt["currency"],4:fmt["currency"],5:fmt["currency"],6:fmt["currency"]},monthly_formulas)

# Dashboard
dash=wb.add_worksheet("Dashboard")
dash.hide_gridlines(2); dash.set_tab_color(NAVY); dash.set_column("A:A",24); dash.set_column("B:B",18); dash.set_column("C:C",4); dash.set_column("D:D",24); dash.set_column("E:E",18); dash.set_column("F:F",4); dash.set_column("G:L",15)
dash.set_row(0,34); dash.merge_range("A1:L1","Women's Clothing Reselling Dashboard",fmt["title"]); dash.merge_range("A2:L2","Use Orders, Products and Expenses as your main input sheets. All KPI cards and charts update automatically.",fmt["subtitle"])
cards=[("A4","Total Orders","=COUNTIF(OrdersTable[Order ID],\"<>\")",fmt["number_bold"]),("D4","Total Revenue","=SUM(OrdersTable[Selling Price])",fmt["currency_bold"]),("G4","Total Cost","=SUM(OrdersTable[Supplier Price])+SUM(OrdersTable[Shipping Cost])",fmt["currency_bold"]),("J4","Total Profit","=SUM(OrdersTable[Profit])",fmt["currency_bold"]),("A7","Pending Orders","=COUNTIF(OrdersTable[Order Status],\"Pending\")",fmt["number_bold"]),("D7","Delivered Orders","=COUNTIF(OrdersTable[Order Status],\"Delivered\")",fmt["number_bold"]),("G7","Cancelled Orders","=COUNTIF(OrdersTable[Order Status],\"Cancelled\")",fmt["number_bold"]),("J7","Average Profit / Order","=IFERROR(AVERAGE(OrdersTable[Profit]),0)",fmt["currency_bold"])]
for cell,label,formula,valuefmt in cards:
    row=int(cell[1:])-1; col=xlsxwriter.utility.xl_cell_to_rowcol(cell)[1]
    dash.write(row,col,label,fmt["label"]); dash.merge_range(row,col,row,col+1,"",valuefmt); dash.write_formula(row,col,formula,valuefmt)
dash.merge_range("A10:F10","Top Selling Products",fmt["section"])
dash.write_row("A11",["Product","Orders"],fmt["header"])
dash.write_dynamic_array_formula("A12:B16",'=LET(products,UNIQUE(FILTER(OrdersTable[Product Name],OrdersTable[Product Name]<>"")),sales,COUNTIF(OrdersTable[Product Name],products),TAKE(SORTBY(CHOOSE({1,2},products,sales),sales,-1,products,1),5))',fmt["text"])
dash.merge_range("A19:F19","Best Performing Month",fmt["section"]); dash.write("A20","Month",fmt["label"]); dash.write("B20","Net Profit",fmt["label"]); dash.write_formula("A21",'=INDEX(MonthlySalesTable[Month],MATCH(MAX(MonthlySalesTable[Net Profit]),MonthlySalesTable[Net Profit],0))',fmt["month"]); dash.write_formula("B21",'=MAX(MonthlySalesTable[Net Profit])',fmt["currency_bold"])

chart1=wb.add_chart({"type":"column"}); chart1.add_series({"name":"Revenue","categories":"='Monthly Sales'!$A$5:$A$16","values":"='Monthly Sales'!$C$5:$C$16","fill":{"color":TEAL},"border":{"none":True}}); chart1.set_title({"name":"Monthly Revenue"}); chart1.set_y_axis({"num_format":"₹#,##0","major_gridlines":{"visible":False}}); chart1.set_legend({"none":True}); chart1.set_style(10); chart1.set_size({"width":520,"height":270})
dash.insert_chart("G10",chart1)
chart2=wb.add_chart({"type":"line"}); chart2.add_series({"name":"Profit","categories":"='Monthly Sales'!$A$5:$A$16","values":"='Monthly Sales'!$E$5:$E$16","line":{"color":TEAL_DARK,"width":2.5},"marker":{"type":"circle","size":5,"border":{"color":TEAL_DARK},"fill":{"color":WHITE}}}); chart2.set_title({"name":"Monthly Profit"}); chart2.set_y_axis({"num_format":"₹#,##0","major_gridlines":{"visible":False}}); chart2.set_legend({"none":True}); chart2.set_style(10); chart2.set_size({"width":520,"height":270})
dash.insert_chart("G25",chart2)
dash.merge_range("A24:F24","How To Use",fmt["section"]); dash.merge_range("A25:F26","1. Add new orders on Orders.  2. Keep catalog prices current on Products.  3. Record overhead on Expenses.  4. Review this dashboard weekly.",fmt["note"])

# Global visual touches and status conditional formats on dashboard/source sheets.
for ws in [orders,products,expenses,customers,returns,monthly]:
    ws.set_default_row(20)
    ws.autofilter if False else None
    ws.freeze_panes(4,0)

wb.close()
print(os.path.abspath(OUT))
