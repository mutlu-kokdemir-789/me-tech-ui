# MeTechUi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


Backend:

Backend tarafinda servis calistirilidiginda https://localhost:7292 uzerinden hizmet vermektedir.
Servisi ayaga kaldirmak icin gereken adimlar:
  - 'me-tech-service/BookStore' dizinine gidin.
  - dotnet run ./BookStore  komutu ile ayaga kaldirilir.


Frontend:

UI projesini ayaga kaldirmak icin gereken adimlar:
  - 'me-tech-ui' dizinine gidin.
  - 'npm i' komutunu calistirin.
  - 'npm run start' komutunu calistirdiktan sonra UI ayaga kalkacaktir.

Dipnot: Servis 'application url' i degistirilmek istenirse UI icinde 
  me-tech-ui\src\services\books.service.ts dosyasinda 18. satirda  ve me-tech-ui\src\services\authentication.service.ts
  dosyasinda 17. satirda url degisikligi yapilmasi gerekmektedir.
