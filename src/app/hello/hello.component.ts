import { Component, OnInit } from '@angular/core';
import { HttpService, Task } from '../http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent implements OnInit {

  form: FormGroup;
  task: Task = {id: null, title: null, date: null};
  tasks: Task[] = [];

  constructor(private http: HttpService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initDate();
    this.buildForm();
    this.readAllTasks();
  }

  private initDate() {
    let date: Date | string = new Date();
    let month: number | string = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    month = month < 10 ? `0${month}` : month;
    date = `${year}-${month}-${day}`;

    this.task.title = 'Привет мир!';
    this.task.date = date;
  }

  private buildForm() {
    this.form = this.fb.group({
      title: [this.task.title, Validators.required],
      date: [this.task.date, Validators.required]
    });

    this.form.valueChanges.subscribe(data => this.onValueChanges(data));
  }

  private onValueChanges(data?: any) {
    if (!this.form) {
      return;
    }
    const form = this.form;

    console.clear();
    console.log('TITLE: ', form.controls.title.value);
    console.log(' DATE: ', form.controls.date.value);

    this.task.title = form.controls.title.value;
    this.task.date = form.controls.date.value;

    console.log(this.task);
  }

  createTask() {
    this.http.post(this.task).subscribe(res => this.tasks.push(res));
  }

  readAllTasks() {
    this.http.get().subscribe(
      res => {
        Object.keys(res).forEach(key => {
          const obj = Object.assign({}, res[key]);
          obj.id = key;
          this.tasks.push(obj);
        });
      });
  }

  updateTask(task: Task) {
    task.title = this.task.title;
    task.date = this.task.date;
    this.http.update(task).subscribe(res => console.log(res));
  }

  deleteTask(task: Task) {
    this.http.delete(task).subscribe(
      () => this.tasks.splice(this.tasks.indexOf(task), 1)
    );
  }

}

