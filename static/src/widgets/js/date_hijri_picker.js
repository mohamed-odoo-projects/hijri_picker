/** @odoo-module **/

import { registry } from "@web/core/registry";
import { loadJS } from "@web/core/assets";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { Component, onWillStart, onMounted } from "@odoo/owl";
const { DateTime } = luxon;
let hijriDatePickerId = 0;

function normalizeArabicNumbers(input) {
    const arabicNums = {
        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
        '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };
    return input.replace(/[٠-٩]/g, d => arabicNums[d] || d);
}

export class DateHijriField extends Component {
    static props = {
        ...standardFieldProps,
    };
    setup() {
        this.hijriDatePickerId = `hijri_datepicker_${hijriDatePickerId++}`;

        onWillStart(async () => {
            await loadJS("/bh_hijri_picker/static/lib/dist/js/moment-with-locales.js");
            await loadJS("/bh_hijri_picker/static/lib/dist/js/bootstrap-hijri-datetimepicker.js");
        });

        onMounted(() => {
            const input = document.getElementById(this.hijriDatePickerId);
            if (input && window.$) {
                $(input).hijriDatePicker({
                    hijri: true,
                    format: "DD/MM/YYYY",
                    hijriFormat: "iDD/iMM/iYYYY",
                    showSwitcher: false,
                });

                // ✅ بعد تهيئة الـ picker، نحط القيمة الحالية يدويًا
                const currentVal = this.formattedValue;
                if (currentVal) {
                    $(input).val(currentVal);
                }

                // ✅ وأحيانًا الـ picker بياخد ثانية لتهيئة الـ DOM الداخلي
                setTimeout(() => {
                    const currentValAgain = this.formattedValue;
                    if (currentValAgain) {
                        $(input).val(currentValAgain);
                    }
                }, 100);
            }
        })

    }

    onBlur(e) {
        let raw = e.target.value?.trim();
        let dateValue = null;

        raw = normalizeArabicNumbers(raw);

        if (raw) {
            let parsed = DateTime.fromFormat(raw, "dd/MM/yyyy");

            if (!parsed.isValid && window.moment) {
                const m = window.moment(raw, "iDD/iMM/iYYYY", true);
                if (m && m.isValid()) {
                    const hijriFormatted = m.format("iYYYY-iMM-iDD");
                    console.log("Detected Hijri input:", hijriFormatted);

                    const [hijriYear, hijriMonth, hijriDay] = hijriFormatted.split("-").map(x => parseInt(x));

                    dateValue = DateTime.fromISO("2000-01-01").set({
                        year: hijriYear,
                        month: hijriMonth,
                        day: hijriDay,
                    });

                }
            } else if (parsed && parsed.isValid) {
                dateValue = parsed.startOf("day");
            } else {
                console.warn("Invalid date input");
                e.target.value = "";
            }
        } else {
            dateValue = null;
        }

        if (this.props.record && this.props.name) {
            this.props.record.update({ [this.props.name]: dateValue });
        } else {
            console.warn("record or name is missing", this.props);
        }
    }


    get formattedValue() {
        if (!this.props.record || !this.props.name) return "";

        const val = this.props.record.data[this.props.name];

        if (!val) return "";

        let dt;
        if (typeof val === "string") {
            dt = DateTime.fromISO(val);
        } else if (val instanceof Date) {
            dt = DateTime.fromJSDate(val);
        } else if (val && val.toISODate) {
            dt = val;
        }

        if (dt && dt.isValid) {
            return dt.toFormat("dd/MM/yyyy");
        }

        return "";
    }

    // onBlur(e) {
    //     let raw = e.target.value?.trim();
    //     let dateValue = null;

    //     raw = normalizeArabicNumbers(raw);

    //     if (raw) {
    //         const m = window.moment(raw, "iDD/iMM/iYYYY", true); // تحليل التاريخ الهجري فقط

    //         if (m && m.isValid()) {
    //             // احتفظ بنفس التاريخ الهجري بصيغة ثابتة
    //             const hijriFormatted = m.format("iYYYY-iMM-iDD");
    //             console.log("Keeping Hijri format:", hijriFormatted);

    //             // نحفظه كنص بدل تحويله لميلادي
    //             dateValue = hijriFormatted;

    //         } else {
    //             console.warn("Invalid Hijri input");
    //             e.target.value = "";
    //         }
    //     } else {
    //         dateValue = null;
    //     }

    //     if (this.props.record && this.props.name) {
    //         this.props.record.update({ [this.props.name]: dateValue });
    //         console.log("Updated record with:", this.props.name, dateValue);
    //     } else {
    //         console.warn("record or name is missing", this.props);
    //     }
    // }

    // onBlur(e) {
    //     const raw = e.target.value?.trim();
    //     let dateValue = null;

    //     if (raw) {
    //         let parsed = DateTime.fromFormat(raw, "dd/MM/yyyy");
    //         if (!parsed.isValid && window.moment) {
    //             const m = window.moment(raw, "iDD/iMM/iYYYY");
    //             if (m && m.isValid()) {
    //                 const iso = m.format("YYYY-MM-DD");
    //                 parsed = DateTime.fromISO(iso);
    //             }
    //         }

    //         if (parsed && parsed.isValid) {
    //             dateValue = parsed.startOf("day");
    //         } else {
    //             dateValue = null;
    //             e.target.value = "";
    //         }
    //     } else {

    //         dateValue = null;
    //     }

    //     if (this.props.record && this.props.name) {
    //         this.props.record.update({ [this.props.name]: dateValue });
    //     } else {
    //         console.warn("record or name is missing", this.props);
    //     }
    // }




    // onBlur(e) {
    //     let raw = e.target.value?.trim();
    //     let dateValue = null;

    //     console.log("Raw input before normalization:", raw);
    //     raw = normalizeArabicNumbers(raw); // لو المستخدم كتب بالأرقام الهندية
    //     console.log("Normalized input:", raw);

    //     if (raw) {
    //         console.log("Parsing Hijri date with moment...");
    //         const m = window.moment(raw, "iDD/iMM/iYYYY", true); // تحليل التاريخ الهجري

    //         console.log("Moment Hijri result:", m ? m.format() : "null", "isValid:", m && m.isValid());

    //         if (m && m.isValid()) {
    //             const iso = m.format("YYYY-MM-DD"); // تحويله لتاريخ ميلادي بصيغة ISO
    //             console.log("Converted Hijri to ISO (Gregorian):", iso);

    //             const parsed = DateTime.fromISO(iso); // تحويله لـ Luxon DateTime
    //             console.log("Parsed ISO with Luxon:", parsed.toString(), "isValid:", parsed.isValid);

    //             if (parsed.isValid) {
    //                 dateValue = parsed.startOf("day");
    //                 console.log("Final dateValue:", dateValue.toISO());
    //             } else {
    //                 console.warn("Luxon failed to parse ISO date");
    //                 dateValue = null;
    //                 e.target.value = "";
    //             }
    //         } else {
    //             console.warn("Invalid Hijri input");
    //             dateValue = null;
    //             e.target.value = "";
    //         }
    //     } else {
    //         console.log("Empty input, clearing date");
    //         dateValue = null;
    //     }

    //     console.log("Before update - sending:", typeof dateValue, dateValue);

    //     if (this.props.record && this.props.name) {
    //         this.props.record.update({ [this.props.name]: dateValue });
    //         console.log("Updated record with:", this.props.name, dateValue.toISO?.());
    //     } else {
    //         console.warn("record or name is missing", this.props);
    //     }
    // }


    // get formattedValue() {
    //     if (!this.props.record || !this.props.name) return "";

    //     const val = this.props.record.data[this.props.name];
    //     if (!val) return "";
    //     let dt = null;

    //     if (typeof val === "string") {
    //         const clean = val.split(" ")[0];
    //         dt = DateTime.fromISO(clean);
    //     } else if (val instanceof Date) {
    //         dt = DateTime.fromJSDate(val);
    //     } else if (val && val.toISODate) {
    //         dt = val;
    //     }

    //     if (dt && dt.isValid) {
    //         return dt.toFormat("dd/MM/yyyy");
    //     }
    //     console.warn("Invalid date in formattedValue:", val);
    //     return "";
    // }



}

DateHijriField.template = "datetime_calendar.DateHijriField";

registry.category("fields").add("hijri_date", {
    component: DateHijriField,
    displayName: "Hijri Date",
    supportedTypes: ["date", "datetime"],
});

