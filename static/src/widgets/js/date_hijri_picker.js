/** @odoo-module **/

import { registry } from "@web/core/registry";
import { loadJS } from "@web/core/assets";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { Component, onWillStart, onMounted } from "@odoo/owl";
const { DateTime } = luxon;
let hijriDatePickerId = 0;

export class DateHijriField extends Component {
    static props = {
        ...standardFieldProps,
    };
    setup() {
        this.hijriDatePickerId = `hijri_datepicker_${hijriDatePickerId++}`;

        onWillStart(async () => {
            await loadJS("/bh_hijri_picker/static/lib/dist/js/bootstrap-hijri-datepicker.min.js");
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
            }
        })
    }

    onBlur(e) {
        const raw = e.target.value?.trim();
        let dateValue = null;

        if (raw) {
            let parsed = DateTime.fromFormat(raw, "dd/MM/yyyy");
            if (!parsed.isValid && window.moment) {
                const m = window.moment(raw, "iDD/iMM/iYYYY");
                if (m && m.isValid()) {
                    const iso = m.format("YYYY-MM-DD");
                    parsed = DateTime.fromISO(iso);
                }
            }

            if (parsed && parsed.isValid) {
                dateValue = parsed.startOf("day");
            } else {
                dateValue = null;
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


}

DateHijriField.template = "datetime_calendar.DateHijriField";

registry.category("fields").add("hijri_date", {
    component: DateHijriField,
    displayName: "Hijri Date",
    supportedTypes: ["date", "datetime"],
});

