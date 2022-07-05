import pandas as pd
from datetime import datetime
import json
from pymongo import MongoClient
import certifi
import base64
import pycountry

from crawlers.WEO import WEO_Categories

class WEO_Parser:
    def __init__(self) -> None:
        self.frame = pd.read_csv('./tmp/weo.xls', index_col=0, sep='\t', encoding='utf-16-le')
        self.cols  = list(self.frame.columns)
        
        self.desc   = []
        self.years  = []
        self.syears = []

        self.added_countries = []
        self.tmp = []

    def upload(self) -> None:
        ca     = certifi.where()
        client = MongoClient("mongodb+srv://root:root@cluster0.sbwn1.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=ca)
        db     = client.SigmyzeData
        col    = db['WEO']

        categories_obj = WEO_Categories.weo_categories
        categories     = list(categories_obj.keys())

        metadata = col.find_one({ "object_id": "metadata" })
        if metadata == None:
            image_loc = './res/WEO/dataset_logo.png'
            with open(image_loc, "rb") as img_file:
                b64_string = base64.b64encode(img_file.read()).decode('utf-8')

            metadata_obj = {
                "object_id": "metadata",
                "added_countries": self.added_countries,
                "categories": categories,
                "logo": str(b64_string)
            }

            col.insert_one(metadata_obj)
            col.insert_many(self.tmp)
        else:
            added_countries = metadata['added_countries']
            for country in added_countries:
                level_index  = next((i for i, item in enumerate(self.tmp) if item['object_id'] == country), -1)
                midlevel_obj = self.tmp[level_index]
                col.update_one({ "object_id": country }, { "$set": midlevel_obj }) 

    def assign_category(self, indicator_id):
        categories        = WEO_Categories.weo_categories
        cat_list          = categories.keys()
        assigned_category = "All"

        for category in cat_list:
            object_ids = categories[category]
            if indicator_id in object_ids:
                assigned_category = category

        print(assigned_category)
        return assigned_category

    
    def parse(self) -> None:
        append_years = False
        d_format     = "%Y"

        for col in self.cols:
            if col == 'Country/Series-specific Notes':
                append_years = True
                continue
            if col == 'Estimates Start After':
                append_years = False
            if append_years == True:
                self.years.append(col)
                self.syears.append(col)
            if append_years == False:
                self.desc.append(col)
        
        #convert years to dates
        for i in range(len(self.years)):
            year = self.years[i]
            d_yr = datetime.strptime(year, d_format)
            self.years[i] = d_yr
        
        col_dict = {}
        for col in self.cols:
            col_dict[col] = self.frame[col].to_numpy()
        
        iso_codes = col_dict['ISO']
        for i in range(len(iso_codes)):
            iso_code  = iso_codes[i]
            if type(iso_code) != str:
                continue

            fullname      = col_dict['Country'][i]
            indicator_id  = col_dict['WEO Subject Code'][i]
            indicator_cat = self.assign_category(indicator_id)

            data_obj  = {
                'indicator_id': indicator_id,
                'indicator_units': col_dict['Units'][i],
                'indicator_name': col_dict['Subject Descriptor'][i],
                'indicator_category': indicator_cat,
                'indicator_data': []
            }

            for x in range(len(self.syears)):
                year = self.syears[x]
                val  = col_dict[year][i]

                if val == '--':
                    val = None
                if type(val) == str:
                    val = val.replace(',', '')
                    val = float(val)

                data_obj['indicator_data'].append({
                    'year': self.years[x],
                    'value':  val,
                    'projection': False
                })

            if iso_code not in self.added_countries:
                object_country = pycountry.countries.get(alpha_3=iso_code)
                if object_country == None:
                    continue

                object_image   = './res/WEO/object_logos/{}.svg'.format(object_country.alpha_2)
                with open(object_image, "rb") as img_file:
                    b64_string = base64.b64encode(img_file.read()).decode('utf-8')

                self.added_countries.append(iso_code)
                self.tmp.append({
                    'object_id': iso_code,
                    'object_fullname': fullname,
                    'object_logo': str(b64_string),
                    'indicators': []
                })

            #find the object
            level_index = next((i for i, item in enumerate(self.tmp) if item['object_id'] == iso_code), -1)
            midlevel    = self.tmp[level_index]
            midlevel['indicators'].append(data_obj)
            self.tmp[level_index] = midlevel
        
        with open('./tmp/weo_parsed.json', 'w') as f:
            json.dump(self.tmp, f, ensure_ascii=False, indent=4, default=str)
        self.upload()