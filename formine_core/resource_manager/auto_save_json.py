from typing import Any
import json
import os


class AutoSaveJSON(dict):
    """
        JSON dosyasını otomatik olarak kaydeder.
        Nested destekler:
        * dict
        * list
        
        Özellikler:
        * Sahip olunmayan öğe için None döner
        * _ ile başlayan değişkenler sadece sınıfa aittir
    """
    def __init__(self,  autosave=True, file_path="", nestedsave=None, **kwargs):
        self._autosave = None
        self._nestedsave = nestedsave
        self._filepath = file_path
        self.load()
        
        super().__init__(**kwargs)
        self._autosave = autosave
        
    
    def __getattribute__(self, key):
        """Eğer aranan değişken yoksa None döner"""
        
        if key.startswith("_"):
            return super().__getattribute__(key)
        
        if key in self:
            return self[key]
        
        try:
            return super().__getattribute__(key)
        except AttributeError:
            return None
    
    def __getitem__(self, key):
        try:
            return super().__getitem__(key)
        except KeyError:
            return None

    def __convert_to_autosave__(self, value):
        if isinstance(value, dict):
            value = AutoSaveJSON(nestedsave=self.save, **value)
            
            for key, val in value.items():
                value[key] = self.__convert_to_autosave__(val)
                
        elif isinstance(value, list):
            value = AutoSaveList(value, nestedsave=self.save)
            
            for i, val in enumerate(value):
                value[i] = self.__convert_to_autosave__(val)
        
        return value

    def __setattr__(self, key, value):
        """Override to automatically save the data when any attribute is changed."""
        if key.startswith("_"):
            super().__setattr__(key, value)
        else:
            self[key] = value
        
            
    def __setitem__(self, key, value):
        # Item olarak veri atamayı destekle
        
        value = self.__convert_to_autosave__(value)
        # if isinstance(value, dict):
        #     value = AutoSaveJSON(nestedsave=self.save, **value)
        # elif isinstance(value, list):
        #     value = AutoSaveList(value, nestedsave=self.save)
            
        super().__setitem__(key, value)
        
        if self._autosave:
            self.save()
    
    def __delitem__(self, key):
        value = super().__delitem__(key)
        
        if self._autosave:
            self.save()
            
        return value
    
    def pop(self, *args, **kwargs):
        value = super().pop(*args, **kwargs)
        if self._autosave:
            self.save()
        return value
    
    @property
    def last_saved(self):
        fp = self._filepath
        if os.path.exists(fp):
            return os.path.getmtime(fp)
        return 0
    
    def save(self, filepath=""):
        """Save the current object state to a JSON file."""
        if self._nestedsave: self._nestedsave()
        
        # Yol yoksa bitir
        if not (filepath or self._filepath): return

        with open(filepath or self._filepath, "w", encoding="utf-8") as json_file:
            json.dump(self, json_file, ensure_ascii=False, indent=4)

    def load(self, filepath=""):
        """Dosyadan verileri oku ve sınıfın özelliklerine yükle."""
        # Yol yoksa bitir
        if not (os.path.exists(filepath) or os.path.exists(self._filepath)): return
        
        with open(filepath or self._filepath, "r", encoding="utf-8") as json_file:
            for key, item in json.load(json_file).items():
                self[key] = item
            # self.update(**json.load(json_file))


class AutoSaveList(list):
    def __init__(self, *args, autosave=True, nestedsave=None, **kwargs):
        self._autosave = None
        self._nestedsave = nestedsave
        
        super().__init__(*args, **kwargs)
        self._autosave = autosave
    
    
    def __update_value(self, value):
        """
        Ortak metod: Herhangi bir ekleme işleminde tetiklenir.
        """
        if isinstance(value, (dict, list)):
            if isinstance(value, dict):
                return AutoSaveJSON(nestedsave=self._nestedsave, **value)
            else:
                return AutoSaveList(nestedsave=self._nestedsave, *value)
        
        return value
    
    def __on_updated(self):
        if self._autosave:
            self._nestedsave()
            
    def __setitem__(self, index: int, value: Any):
        """Listeye öğe eklerken veya değiştirirken otomatik kaydet."""
        super().__setitem__(index, self.__update_value(value))
        self.__on_updated()
    
    def append(self, value: Any):
        super().append(self.__update_value(value))
        self.__on_updated()
        
    def extend(self, values: list):
        super().extend(self.__update_value(values))
        self.__on_updated()
        
    def insert(self, index: int, value: Any):
        super().insert(index, self.__update_value(value))
        self.__on_updated()
        
    def remove(self, value: Any):
        super().remove(value)
        self.__on_updated()

    def clear(self):
        super().clear()
        self.__on_updated()

    def reverse(self):
        super().reverse()
        self.__on_updated()

    def pop(self, index=-1):
        value = super().pop(index)
        self.__on_updated()
        return value
        

