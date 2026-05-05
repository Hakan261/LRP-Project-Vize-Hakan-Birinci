# LRP - Laboratuvar Kaynak Planlama Sistemi (Aşama-1)

Bu proje, **.NET Minimal API**, **Entity Framework Core (SQLite)** ve **Vanilla JavaScript** kullanarak laboratuvar, bilgisayar ve öğrenci sorumluluk yönetimini sağlayan bir temel sistemdir.

## Özellikler

- Admin ve Student rolü ile kimlik doğrulama
- Admin panelinde laboratuvar ekleme ve listeleme
- Bilgisayar ekleme, demirbaş kodu üretimi ve teknik özellik kaydı
- Öğrenci atandığında öğrenci hesabı otomatik oluşturma
- Öğrenci panelinde sadece kendisine atanan bilgisayar bilgilerini görüntüleme
- Sayfalar yenilenmeden içerik güncelleyen Vanilla JavaScript SPA mantığı

## Kurulum

1. `.NET 6 SDK` yüklü olmalıdır.
2. Klasöre gidin:

```powershell
cd c:\Users\MONSTER\Desktop\Hakan_Birinci_231903006
```

3. Bağımlılıkları yükleyin ve veritabanı için `dotnet restore` çalıştırın:

```powershell
dotnet restore
```

4. Uygulamayı çalıştırın:

```powershell
dotnet run
```

5. Tarayıcıda `http://localhost:5000/login.html` adresine gidin.

## Kullanıcı Bilgileri

- **Admin hesap:** `admin` / `Admin@123`
- **Öğrenci hesap:** Öğrenci atandığında otomatik oluşturulur
  - Kullanıcı adı: Öğrenci numarası
  - Parola: `ÖğrenciNo@2026` (örn: `231903006@2026`)

## Notlar

- Proje, `.db`, `bin`, `obj` gibi dosyaları `.gitignore` ile hariç tutar.
- Öğrenci atandığında parola olarak `ÖğrenciNo@2026` otomatik oluşturulur.
- Admin sayfası `index.html`, öğrenci sayfası `student.html` olarak ayrılmıştır.
