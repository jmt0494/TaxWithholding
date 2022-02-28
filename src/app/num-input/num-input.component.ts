import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-num-input',
  templateUrl: './num-input.component.html',
  styleUrls: ['./num-input.component.scss']
})
export class NumInputComponent implements OnInit {

  @Input() name = ''
  @Output() userInput = new EventEmitter<string>();

  constructor() { }

  emitInput(input: string) {
    this.userInput.emit(input)
  }

  ngOnInit(): void {
  }

}
