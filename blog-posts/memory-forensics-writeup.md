---
title: "Memory - Forensics CTF Writeup"
pubDate: "2026-07-08"
description: "Writeup untuk challenge CTF Forensics 'Memory'. Memulihkan file flag.png terenkripsi AES-256 dari memory dump Windows menggunakan Volatility."
featured: true
---

# Memory

**Category:** Forensics

> "aku ninggalin gambar flagnya di Desktop, tapi tiba-tiba hilang... kamu bisa ga bantu aku recover flagnya?"

**Attachment:**
[Download Memory Dump](https://drive.google.com/file/d/1DHEQLPOXdJzidis-2cwe9UUw0mb327ZO/view)

---

## Analisis Awal

Dari deskripsi soal, ada hint penting yaitu kata **"Desktop"**. Ini menunjukkan bahwa path file flag ada di Desktop. Karena itu, kita akan menggunakan plugin `mftparser` dan `filescan` dari Volatility.

<img width="1920" height="1128" alt="image" src="https://github.com/user-attachments/assets/89f59719-0a03-4679-b310-2d5ae896ba7e" />

Pertama-tama, kita perlu mengenali profil dari memory dump ini. Gunakan plugin `windows.info` dari Volatility3 untuk mengecek profilnya.

Dari output plugin `windows.info`, dapat disimpulkan bahwa file ini di-dump dari **Windows 10 Build 19041 (64-bit)**. Maka, profil yang cocok untuk Volatility2 adalah `Win10x64_19041`.

---

## Mencari File Flag

<img width="1920" height="1128" alt="image" src="https://github.com/user-attachments/assets/7060cc63-7844-480a-aae1-ad268f46fccf" />

Pertama, dicoba menggunakan plugin `windows.filescan` dari Volatility3 dan di-grep dengan kata kunci "desktop", namun tidak mendapatkan hasil apapun.

<img width="1920" height="1128" alt="image" src="https://github.com/user-attachments/assets/1933cda5-fd21-4d57-ac61-cb0512ca9832" />

Kemudian dicoba menggunakan plugin `mftparser` dari Volatility2 dengan command berikut:

```bash
vol2 -f memdump.mem --profile=Win10x64_19041 mftparser | grep -i "desktop"
```

Hasilnya, ditemukan file bernama `flag.enc` di Desktop.

> **Kenapa `filescan` Volatility3 tidak berhasil?**
> Plugin `filescan` hanya mencari file yang masih terdaftar di memory (file object yang aktif). Sedangkan `mftparser` membaca langsung dari struktur MFT (Master File Table) di disk image, sehingga bisa menemukan file yang sudah dihapus atau tidak lagi aktif di memory.

---

## Menemukan Script Enkripsi

Ketika dicoba dump `flag.enc` menggunakan plugin `dumpfiles`, file tersebut tidak ditemukan di memory dump. Artinya, file ini sudah tidak aktif di memory.

<img width="1920" height="1128" alt="image" src="https://github.com/user-attachments/assets/2b3d4c78-2207-42b6-9ede-80e5a884b96b" />

Langkah selanjutnya, dilakukan pencarian manual menggunakan fitur **Find** di HxD dengan kata kunci `"flag.enc"`. Dari sini, ditemukan script PowerShell berikut:

```powershell
$ifPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'), 'flag.png')
$efPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'), 'flag.enc')

$aes = New-Object System.Security.Cryptography.AesManaged
$aes.KeySize = 256
$aes.BlockSize = 128
$aes.GenerateKey()
$aes.GenerateIV()

$cee = [System.Convert]::ToBase64String($aes.Key)
$vee = [System.Convert]::ToBase64String($aes.IV)

$content = [System.IO.File]::ReadAllBytes($ifPath)

$encryptor = $aes.CreateEncryptor($aes.Key, $aes.IV)
$encryptedData = $encryptor.TransformFinalBlock($content, 0, $content.Length)

$encryptedBase64 = [System.Convert]::ToBase64String($encryptedData)

[System.IO.File]::WriteAllText($efPath, $encryptedBase64)

[System.Environment]::SetEnvironmentVariable("ENCD", $encryptedBase64, [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("ENCK", $cee, [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("ENCV", $vee, [System.EnvironmentVariableTarget]::User)

if (Test-Path $ifPath) {
    Remove-Item $ifPath -Force
}
```

Dari script ini terlihat bahwa:
- `flag.png` dienkripsi menggunakan **AES-256**
- Key, IV, dan hasil enkripsi (dalam format Base64) disimpan ke **Environment Variable** dengan nama `ENCK`, `ENCV`, dan `ENCD`
- Setelah dienkripsi, `flag.png` asli **dihapus**

---

## Mengambil Key, IV, dan Data dari Environment Variable

<img width="1920" height="1128" alt="image" src="https://github.com/user-attachments/assets/ac977386-2075-407b-bcf9-bb3084e02723" />

Gunakan plugin `windows.envars` dari Volatility3 untuk melihat isi environment variable:

```bash
vol3 -f memdump.mem windows.envars | grep -E "ENCD|ENCK|ENCV"
```

Dari output plugin ini, langsung terlihat nilai **image data (ENCD)**, **key (ENCK)**, dan **IV (ENCV)** dalam format Base64.

---

## Dekripsi Flag

<img width="1913" height="988" alt="image" src="https://github.com/user-attachments/assets/9ed7ca58-3f1f-4bea-bc5d-a73eb0a34590" />

Masukkan ketiga nilai tersebut ke **CyberChef** dengan operasi **AES Decrypt**:
- **Key:** nilai dari `ENCK` (Base64)
- **IV:** nilai dari `ENCV` (Base64)
- **Input:** nilai dari `ENCD` (Base64)

<img width="1115" height="272" alt="image" src="https://github.com/user-attachments/assets/5e6e2391-0920-42d0-be3c-bcaa69af7b4d" />

Dan flag pun berhasil didapatkan!

---

## Flag

```
FGTE{follin4_m3mOry_dump3r_succ3ss_c0ngr4ts}
```
