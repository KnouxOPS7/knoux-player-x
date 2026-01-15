#ifndef FAVICON_PLACEHOLDER_H
#define FAVICON_PLACEHOLDER_H

// Placeholder for ICO file structure
// Actual conversion handled by build process
// Contains references to app icons for different resolutions
typedef struct {
    WORD Reserved;          
    WORD Type;              
    WORD Count;             
    BYTE Width;             
    BYTE Height;            
    BYTE ColorCount;        
    BYTE Reserved2;         
    WORD Planes;            
    WORD BitCount;          
    DWORD BytesInRes;       
    DWORD ImageOffset;      
} ICOHEADER;

static const unsigned char favicon_placeholder[] = {
    0x00, 0x00, 0x01, 0x00,  // ICO header
    0x01, 0x00,              // Icon count
    0x10, 0x10,              // 16x16 dimensions
    0x00, 0x00, 0x01, 0x00,  // Color info and planes
    0x20, 0x00,              // 32-bit
    0x00, 0x00, 0x00, 0x00,  // Size placeholder
    0x16, 0x00, 0x00, 0x00   // Data offset
};

#endif // FAVICON_PLACEHOLDER_H
