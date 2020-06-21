window.PE = (function() {
 //docs.microsoft.com/en-us/windows/win32/debug/pe-format#file-headers
 var _data = new Uint8Array();

 var db = {
  characteristics: [
   { flag: "IMAGE_FILE_NONE", value: 0x0, desc: "NONE" },
   {
    flag: "IMAGE_FILE_RELOCS_STRIPPED",
    value: 0x0001,
    desc:
     "Image only, Windows CE, and Microsoft Windows NT and later. This indicates that the file does not contain base relocations and must therefore be loaded at its preferred base address. If the base address is not available, the loader reports an error. The default behavior of the linker is to strip base relocations from executable (EXE) files."
   },
   {
    flag: "IMAGE_FILE_EXECUTABLE_IMAGE",
    value: 0x0002,
    desc:
     "Image only. This indicates that the image file is valid and can be run. If this flag is not set, it indicates a linker error."
   },
   {
    flag: "IMAGE_FILE_LINE_NUMS_STRIPPED",
    value: 0x0004,
    desc:
     "COFF line numbers have been removed. This flag is deprecated and should be zero."
   },
   {
    flag: "IMAGE_FILE_LOCAL_SYMS_STRIPPED",
    value: 0x0008,
    desc:
     "COFF symbol table entries for local symbols have been removed. This flag is deprecated and should be zero."
   },
   {
    flag: "IMAGE_FILE_AGGRESSIVE_WS_TRIM",
    value: 0x0010,
    desc:
     "Obsolete. Aggressively trim working set. This flag is deprecated for Windows 2000 and later and must be zero."
   },
   {
    flag: "IMAGE_FILE_LARGE_ADDRESS_ AWARE",
    value: 0x0020,
    desc: "Application can handle > 2-GB addresses."
   },
   {
    flag: "IMAGE_FILE_RESERVED",
    value: 0x0040,
    desc: "This flag is reserved for future use."
   },
   {
    flag: "IMAGE_FILE_BYTES_REVERSED_LO",
    value: 0x0080,
    desc:
     "Little endian: the least significant bit (LSB) precedes the most significant bit (MSB) in memory. This flag is deprecated and should be zero."
   },
   {
    flag: "IMAGE_FILE_32BIT_MACHINE",
    value: 0x0100,
    desc: "Machine is based on a 32-bit-word architecture."
   },
   {
    flag: "IMAGE_FILE_DEBUG_STRIPPED",
    value: 0x0200,
    desc: "Debugging information is removed from the image file."
   },
   {
    flag: "IMAGE_FILE_REMOVABLE_RUN_ FROM_SWAP",
    value: 0x0400,
    desc:
     "If the image is on removable media, fully load it and copy it to the swap file."
   },
   {
    flag: "IMAGE_FILE_NET_RUN_FROM_SWAP",
    value: 0x0800,
    desc:
     "If the image is on network media, fully load it and copy it to the swap file."
   },
   {
    flag: "IMAGE_FILE_SYSTEM",
    value: 0x1000,
    desc: "The image file is a system file, not a user program."
   },
   {
    flag: "IMAGE_FILE_DLL",
    value: 0x2000,
    desc:
     "The image file is a dynamic-link library (DLL). Such files are considered executable files for almost all purposes, although they cannot be directly run."
   },
   {
    flag: "IMAGE_FILE_UP_SYSTEM_ONLY",
    value: 0x4000,
    desc: "The file should be run only on a uniprocessor machine."
   },
   {
    flag: "IMAGE_FILE_BYTES_REVERSED_HI",
    value: 0x8000,
    desc:
     "Big endian: the MSB precedes the LSB in memory. This flag is deprecated and should be zero."
   }
  ],
  machineTypes: {
   "0000": {
    constant: "UNKNOWN",
    desc:
     "The contents of this field are assumed to be applicable to any machine type"
   },
   "01d3": { constant: "AM33", desc: "Matsushita AM33" },
   "8664": { constant: "AMD64", desc: "x64" },
   "01c0": { constant: "ARM", desc: "ARM little endian" },
   aa64: { constant: "ARM64", desc: "ARM64 little endian" },
   "01c4": { constant: "ARMNT", desc: "ARM Thumb-2 little endian" },
   "0ebc": { constant: "EBC", desc: "EFI byte code" },
   "014c": {
    constant: "I386",
    desc: "Intel 386 or later processors and compatible processors"
   },
   "0200": { constant: "IA64", desc: "Intel Itanium processor family" },
   "9041": { constant: "M32R", desc: "Mitsubishi M32R little endian" },
   "0266": { constant: "MIPS16", desc: "MIPS16" },
   "0366": { constant: "MIPSFPU", desc: "MIPS with FPU" },
   "0466": { constant: "MIPSFPU16", desc: "MIPS16 with FPU" },
   "01f0": { constant: "POWERPC", desc: "Power PC little endian" },
   "01f1": {
    constant: "POWERPCFP",
    desc: "Power PC with floating point support"
   },
   "0166": { constant: "R4000", desc: "MIPS little endian" },
   "5032": { constant: "RISCV32", desc: "RISC-V 32-bit address space" },
   "5064": { constant: "RISCV64", desc: "RISC-V 64-bit address space" },
   "5128": { constant: "RISCV128", desc: "RISC-V 128-bit address space" },
   "01a2": { constant: "SH3", desc: "Hitachi SH3" },
   "01a3": { constant: "SH3DSP", desc: "Hitachi SH3 DSP" },
   "01a6": { constant: "SH4", desc: "Hitachi SH4" },
   "01a8": { constant: "SH5", desc: "Hitachi SH5" },
   "01c2": { constant: "THUMB", desc: "Thumb" },
   "0169": { constant: "WCEMIPSV2", desc: "WCEMIPSV2" }
  }
 };

 const setData = function(data) {
  _data = data;
  setCharacteristics(
   Number.parseInt(
    UI.bytesToHex(PE.get(PE.range.coff.characteristics()))
   )
  );
 };

 const getData = function() {
  return _data;
 };

 const get = function(param) {
  return _data.slice(param.offset, param.offset + param.size).reverse();
 };

 const range = {
  start: function() {
   return { offset: _data[0x3c], size: 4 };
  },
  signature: function() {
   return { offset: range.start().offset, size: 4 };
  },
  coff: {
   start: function() {
    return {
     offset: range.signature().offset + range.signature().size,
     size: 20
    };
   },
   machine: function() {
    return { offset: range.coff.start().offset, size: 2 };
   },
   numberOfSections: function() {
    return { offset: range.coff.start().offset + 2, size: 2 };
   },
   timeDateStamp: function() {
    return { offset: range.coff.start().offset + 4, size: 4 };
   },
   pointerToSymbolTable: function() {
    return { offset: range.coff.start().offset + 8, size: 4 };
   },
   sizeOfOptionalHeader: function() {
    return { offset: range.coff.start().offset + 16, size: 2 };
   },
   characteristics: function() {
    return { offset: range.coff.start().offset + 18, size: 2 };
   }
  }
 };

 const signature = function() {
  var raw = get(range.signature()).reverse();
  var hex = _.map(raw, UI.toHex);
  return hex;
 };

 const machine = function() {
  var raw = get(range.coff.machine());
  var machineType = UI.bytesToHex(raw);
  var result = db.machineTypes[machineType];
  return result;
 };

 const numOfSections = function () {
   var raw = get(range.coff.numberOfSections()).reverse();
   var result = _.reduce(_.map(raw, function(val, i) { return val * (0x100**i); }), function(memo, num) { return memo + num; }, 0);
   return result;
 };

 const characteristics = function() {
  
  if(PE.getCharacteristics() == 0x0) {
   return [db.characteristics[0]];
  };
  
  var result = new Array();
  
  _.each( _.filter(db.characteristics, x => x.value > 0), function(c, i) {
   if ((PE.getCharacteristics() & c.value) == c.value) {
    result.push(c);
   }
  });
  
  return result;
 };
 
 const timeDateStamp = function () {
  var raw = get(range.coff.timeDateStamp()).reverse();
  var result = _.reduce(_.map(raw, function(val, i) { return val * (0x100**i); }), function(memo, num) { return memo + num; }, 0);
  debugger;
  return result;
 };

 const sizeOfOptionalHeader = function() {
  var raw = get(range.coff.sizeOfOptionalHeader()).reverse();
  var result = _.reduce(_.map(raw, function(val, i) { return val * (0x100**i); }), function(memo, num) { return memo + num; }, 0);
  debugger;
  return result;
 }

 var _characterisctics = 0;
 const getCharacteristics = function() {
  return _characterisctics;
 };
 const setCharacteristics = function(value) {
  _characterisctics = value;
 };

 return {
  setData
  ,getData
  ,characteristics
  ,getCharacteristics
  ,setCharacteristics
  ,signature
  ,get
  ,machine
  ,numOfSections
  ,timeDateStamp
  ,sizeOfOptionalHeader
  ,range
 };
})();
