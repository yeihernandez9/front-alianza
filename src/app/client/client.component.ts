import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Client } from './client';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { ExportCsvService } from './export-csv.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {

  validateNew() {
    this.statusEdit = false;
    this.statusNew = true;
  }
  client: Client[] = [];
  clientSearch: Client[] = [];
  name: string = '';
  email: string = '';
  phone: string = '';
  startDate: string = '';
  endDate: string = '';
  searchTerm: string = '';
  statusEdit = false;
  statusNew = false;
  clienteEdit?: Client;
  headers: any[] = ["name", "email", "phone", "startDate", "endDate"];

  profileForm = new FormGroup({
    idClient: new FormControl(''),
    nameClient: new FormControl(''),
    emailClient: new FormControl(''),
    phoneClient: new FormControl(''),
    startDateClient: new FormControl(''),
    endDateClient: new FormControl(''),
  });

  searchTerm$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private csvService: ExportCsvService
    ) {
    //this.client = new Client();
  }

  onSearch(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;

    if (!newValue) {
      this.clientSearch = this.client;
      return;
    }

    this.clientSearch = this.client.filter((item) =>
      item?.name.toLowerCase().includes(newValue.toLowerCase())
    );
  }

  urlClient = 'http://localhost:8080/client';

  editClient(arg0: string | undefined) {
    this.statusEdit = true;
    this.statusNew = false;
    console.log(arg0);

    this.clienteEdit = this.client.find((item) => item.id == arg0);

    this.profileForm.patchValue({
      idClient: this.clienteEdit?.id,
      nameClient: this.clienteEdit?.name,
      emailClient: this.clienteEdit?.email,
      phoneClient: this.clienteEdit?.phone,
      startDateClient: this.clienteEdit?.startDate,
      endDateClient: this.clienteEdit?.endDate,
    });
  }

  httpClient = inject(HttpClient);
  ngOnInit(): void {
    this.httpClient.get(this.urlClient).subscribe((data: any) => {
      console.log(data.content);
      this.client = data.content;
      this.clientSearch = this.client;
    });

    this.initializeForm();
  }
  initializeForm() {
    this.profileForm = this.fb.group({
      idClient: [''], // Add appropriate validators if needed
      nameClient: ['', Validators.required],
      phoneClient: [''],
      emailClient: ['', [Validators.required, Validators.email]],
      startDateClient: [''],
      endDateClient: [''],
    });
  }

  onSubmit() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // otras cabeceras si es necesario
    });

    if (this.profileForm.valid) {
      // Realizar acciones cuando el formulario es válido
      console.log('Formulario válido:', this.profileForm.value);
      if (this.statusNew) {
        const dataToSend = {
          name: this.profileForm.value.nameClient,
          phone: this.profileForm.value.phoneClient,
          email: this.profileForm.value.emailClient,
          startDate: this.profileForm.value.startDateClient,
          endDate: this.profileForm.value.endDateClient,
        };

        console.log('data', dataToSend);

        this.httpClient
          .post(`${this.urlClient}`, dataToSend, { headers })
          .subscribe(
            (data: any) => {
              console.log(data);
              this.client = data.content;
              this.ngOnInit();
              this.profileForm.reset();
            },
            (error) => {
              console.error('Error en la solicitud POST:', error);
            }
          );
      } else {
        const dataToSend = {
          id: this.profileForm.value.idClient,
          name: this.profileForm.value.nameClient,
          phone: this.profileForm.value.phoneClient,
          email: this.profileForm.value.emailClient,
          startDate: this.profileForm.value.startDateClient,
          endDate: this.profileForm.value.endDateClient,
        };
        console.log('data', dataToSend);
        this.httpClient
          .put(
            `${this.urlClient}/${this.profileForm.value.idClient}`,
            dataToSend,
            { headers }
          )
          .subscribe(
            (data: any) => {
              console.log(data);
              this.client = data.content;
              this.ngOnInit();
              this.profileForm.reset();
            },
            (error) => {
              console.error('Error en la solicitud POST:', error);
            }
          );
      }
      this.ngOnInit();
    } else {
      // Realizar acciones cuando el formulario no es válido
      console.log('Formulario inválido');
    }
  }

  onSubmitSearch() {
    const dataToSearch = {
      id: this.profileForm.value.idClient,
      name: this.profileForm.value.nameClient,
      phone: this.profileForm.value.phoneClient,
      email: this.profileForm.value.emailClient,
      startDate: this.profileForm.value.startDateClient,
      endDate: this.profileForm.value.endDateClient,
    };

    console.log(dataToSearch);

    const newValue =
      this.profileForm.value.nameClient?.toLowerCase().trim() ?? '';
    const newPhone =
      this.profileForm.value.phoneClient?.toLowerCase().trim() ?? '';
    const newEmail =
      this.profileForm.value.emailClient?.toLowerCase().trim() ?? '';
      const newStartDate =
      this.profileForm.value.startDateClient?.toLowerCase().trim() ?? '';
      const newEndDate =
      this.profileForm.value.endDateClient?.toLowerCase().trim() ?? '';

    this.clientSearch = this.client.filter(
      (item) =>
        (newValue === '' || item?.name.toLowerCase().includes(newValue)) &&
        (newPhone === '' || item?.phone.toLowerCase().includes(newPhone)) &&
        (newEmail === '' || item?.email.toLowerCase().includes(newEmail)) &&
        (newStartDate === '' || item?.startDate.toLowerCase().includes(newStartDate)) &&
        (newEndDate === '' || item?.endDate.toLowerCase().includes(newEndDate))
    );
  }

  greet() {
    alert('Hola yeison');
  }

  onChangeName() {
    const nameControl = this.profileForm.get('nameClient');
    console.log(nameControl?.value);
    if (nameControl) {
      nameControl.markAsTouched();
    }
  }

  onChangeEmail() {
    const emailControl = this.profileForm.get('emailClient');
    console.log(emailControl?.value);
    if (emailControl) {
      emailControl.markAsTouched();
    }
  }

  downloadCSV() {
    console.log("Descargando CSV");
    this.csvService.csvDownload(this.headers, this.client)
  }
}
