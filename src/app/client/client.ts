export class Client {
  toLowerCase() {
    throw new Error('Method not implemented.');
  }
  id: string;
  name: string;
  phone: string;
  email: string;
  startDate: string;
  endDate: string;

  constructor(id: string, name: string, phone: string, email: string, startDate: string, endDate: string) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.startDate = startDate;
    this.endDate = endDate;
}
}
