{
    "endiannes": "LITTLE",
    "desc": "https://docs.microsoft.com/en-us/windows/win32/debug/pe-format#optional-header-image-only",

    "conditions": {
        "magic": {
            "0x10b": "PE32",
            "0x20b": "PE32+"
        }
    },
    "blocks": [
        { "start": 0, "size": 2, "name": "signature" },
        { "start": "0x3c", "size": 4, "name": "Pointer to PE Header", "ref": "#header" },
        { "start": "#header+0", "size": 4, "name": "Signature", "ref": "#signature" },
        { "start": "#signature+0", "size": 2, "name": "Machine" },
        { "start": "#signature+2", "size": 2, "name": "NumberOfSections" },
        { "start": "#signature+4", "size": 4, "name": "TimeDateStamp" },
        { "start": "#signature+8", "size": 4, "name": "PointerToSymbolTable" },
        { "start": "#signature+12", "size": 4, "name": "NumberOfSymbols" },
        { "start": "#signature+16", "size": 2, "name": "SizeOfOptionalHeader" },
        { "start": "#signature+18", "size": 2, "name": "Characteristics", "ref": "#optional" },
        { "start": "#optional+0", "size": 2, "name": "Magic" },
        { "start": "#optional+2", "size": 1, "name": "MajorLinkerVersion" },
        { "start": "#optional+3", "size": 1, "name": "MinorLinkerVersion" },
        { "start": "#optional+4", "size": 4, "name": "SizeOfCode" },
        { "start": "#optional+8", "size": 4, "name": "SizeOfInitializedData" },
        { "start": "#optional+12", "size": 4, "name": "SizeOfUninitializedData" },
        { "start": "#optional+16", "size": 4, "name": "AddressOfEntryPoint" },
        { "start": "#optional+20", "size": 4, "name": "BaseOfCode" },
        {
            "cond": {
                "magic=PE32": [
                    { "start": 0, "size": 28, "name": "Standard fields" },
                    { "start": 28, "size": 68, "name": "Windows-specific fields" },
                    { "start": 96, "size": "var(#SizeOfOptionalHeader)", "name": "Data directories" }
                ],
                "magic=PE32+": [
                    { "start": 0, "size": 24, "name": "Standard fields" },
                    { "start": 24, "size": 88, "name": "Windows-specific fields" },
                    { "start": 112, "size": "var(#SizeOfOptionalHeader)", "name": "Data directories" }
                ]  
            }
        }
    ]
}