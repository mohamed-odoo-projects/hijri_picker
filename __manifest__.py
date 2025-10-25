# -*- coding: utf-8 -*-
{
    "name": "Hijri Picker",
    "summary": "Custom Odoo widget to select and convert Hijri (Islamic) dates",
    "description": """
        This module adds a custom Odoo widget that allows users to pick Hijri (Islamic) dates.
        The widget automatically converts the selected Hijri date to Gregorian and updates the field value.
        
        Usage:
        Add `widget="hijri_date"` in your XML field definition to enable the Hijri date picker.
    """,
    "author": "Eng. Mohamed Wahib",
    "website": "https://mowahibportfolio.netlify.app/",
    "license": "MIT",
    "category": "Web",
    "version": "1.0",
    "depends": ["base", "web"],
    "assets": {
        "web.assets_backend": [
            "hijri_picker/static/lib/dist/js/*.js",
            "hijri_picker/static/lib/dist/css/*.css",
            "hijri_picker/static/src/widgets/xml/*.xml",
            "hijri_picker/static/src/widgets/js/*.js",
        ],
    },
}
