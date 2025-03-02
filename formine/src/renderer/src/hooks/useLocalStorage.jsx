import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue) => {
    // Session'dan veri alma ve state oluşturma
    const [storedValue, setStoredValue] = useState(() => {
        const item = window.localStorage.getItem(key);
        // return item ? JSON.parse(item) : initialValue;
        return initialValue;
    });

    // State değiştiğinde session storage'ı güncelleme
    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
};

export default useLocalStorage;
