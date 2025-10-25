# 🕌 Hijri Date Picker for Odoo

A custom Odoo widget that allows users to select and display **Hijri (Islamic)** dates alongside Gregorian dates.  
This module provides seamless integration with Odoo fields and supports **bidirectional synchronization** between both calendars.

---

## 🚀 Features

- 📅 Hijri and Gregorian date synchronization  
- 🔄 Auto-conversion between both formats  
- 🧩 Compatible with Odoo 17 / Odoo 18  
- 🪶 Lightweight and easy to extend  
- 💡 Fully implemented in JS + XML (OWL component style)  

---

## 🧩 How to Use

After installing the module, you can use this widget in any XML form view  
by adding the following attribute to your date field:

```xml
<field name="your_field_name" widget="hijri_date"/>

