---
title: "Finding Malicious Application with Prefetch | SNI CTF 2024 - pf-ing"
pubDate: "2025-02-05"
description: 'Write Up of pf-ing from SNI CTF 2024'
---

### pf-ing (prefetch-ing)
##### this is a challenge that i created for SNI CTF 2024
given a memdump files (.mem) with description:

```believe me, its just an intro to DFIR about ransom cases```

If you analyze it with pslist or pstree, you wont notice anything suspicious

Because of that, try to check the prefetch artifacts that residen in the memory dumo

https://www.geeksforgeeks.org/prefetch-files-in-windows/ 

```vol -f dump.dmp windows.filescan | grep ".pf"```

![image](https://github.com/user-attachments/assets/2bd0ab77-5b92-4e6e-a017-b576fb25d638)

Analyze the prefetch files. You will notice there is Edge.exe proccess that suspicious. (Remember that the process of MS Edge is msedge.exe, not Edge.exe)

Analyze the Edge.exe prefetch with PECmd and you will find out that this exe will load some files in the Documents folder, resulting .dll files in `%localappdata%/temp` which is suspicious

![image](https://github.com/user-attachments/assets/38a79151-b37b-44b8-a180-aee06970919e)

By that evidence, you can assume that the Edge.exe is the malicious program and the data might be encrypted in the temp folder.
Proceed to decrypt by dump the Edge.exe and the encrypted files

![image](https://github.com/user-attachments/assets/e3eac30c-7083-40b7-be43-5d0608e166e7)

Decompile Edge.exe

![image](https://github.com/user-attachments/assets/8c0a06c2-f112-4341-8090-ffb841856c9a)

XOR Encryption function.

![image](https://github.com/user-attachments/assets/3dc14694-d4c2-4e97-a728-89048fd146a9)

Key is being randomized but only in the range of % 256 which can be bruteforced

Dumping Encrypted File

![image](https://github.com/user-attachments/assets/a3fc04a7-6b88-44d7-83be-00f7abb014ba)
![image](https://github.com/user-attachments/assets/7021999f-05dc-409f-8d6b-271421acf34b)


Command:

```vol -f dump.dmp windows.dumpfiles --virtaddr {offset}```

Decrypt:

![image](https://github.com/user-attachments/assets/0ff673c6-1b14-465f-af2d-5658028e6b6c)

flag: `SNI{intr0_t0_df1r_and_th1s_g1rl_is_w4y_b3tter_than_Chizuru}`