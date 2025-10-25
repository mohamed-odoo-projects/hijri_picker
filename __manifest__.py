# -*- coding: utf-8 -*-
{
    "name": "Hijri Picker",
    "summary": "Custom field widget to select Hijri (Islamic) dates easily",
    "description": 
    """
        This module adds a custom Odoo widget that allows users to pick Hijri (Islamic) dates.
        The widget automatically converts the selected Hijri date to Gregorian and updates the field value.
    """,
    "author": "Eng.Mohamed Wahib",
    "website": "https://mowahibportfolio.netlify.app/",
    "license": "LGPL-3",
    "category": "Uncategorized",
    "version": "0.1",
    "depends": ["base", "web"],
    "assets": {
        "web.assets_backend": [
            "web/static/lib/jquery/jquery.js",
            "bh_hijri_picker/static/lib/dist/js/*.js",
            "bh_hijri_picker/static/lib/dist/css/*.css",
            "bh_hijri_picker/static/src/widgets/xml/*.xml",
            "bh_hijri_picker/static/src/widgets/js/*.js",
        ],
    },
}
