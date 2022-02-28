import { NgModule } from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
  exports: [
    MatStepperModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
  ],
})
export class MaterialModule {}