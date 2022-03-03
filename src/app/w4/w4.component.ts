import { Component, OnInit } from '@angular/core';
import irsTables from './irsTables'
const {
lowerAxis,
marriedAxis,
singleAxis,
headAxis,
marriedTable,
singleTable,
headTable,
marriedChecked,
singleChecked,
headChecked,
marriedUnchecked,
singleUnchecked,
headUnchecked
} = irsTables as Record<string, []>;
@Component({
  selector: 'app-w4',
  templateUrl: './w4.component.html',
  styleUrls: ['./w4.component.scss']
})
export class W4Component implements OnInit {

  maritalStatus: string; // step 1 box c
  multiJobWithholdings: number = 0; //step 4 box c set before final calc
  credits: number = 0; //step 3
  nonJobAdjust: number = 0; //step 4 box a
  payPeriods: number = 1; // neeeded
  deduction: number = 0; //step 4 box b set before final calc
  grossPay: number = 0
  earnDifferent: boolean | number = 1; //step 2 box c
  multipleJobs: boolean;
  payLabels = ['Higher Paying Job Income', 'Lower Pay', 'Middle Pay (optional)',]
  highPay: number = 0;
  lowPay: number = 0;
  midPay: number = 0;
  dependLabels = ['Dependents under 17', 'Other dependents', 'Any additional Tax Credits']
  minorDepend: number = 0;
  nonMinorDepend: number = 0;
  otherCredits: number = 0;
  itemized: boolean; 
  deductionEst: number = 0; //step 4b worksheet box 3
  otherAdjusts: number = 0; //step 4b worksheet box 4
  fedIncomeTax: number;
  socialSecurity: number;
  medicare: number;
  medicade: number;
  calculated: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  resetPay() {
    this.highPay = 0
    this.lowPay = 0
    this.midPay = 0
  }

  resetAdjusts() {
    this.deductionEst = 0
    this.otherAdjusts = 0
  }

  setPayPeriods(event: string) {
    this.payPeriods = parseInt(event)
  }

  updatePayState(label: string, event: string) {
    if (label === this.payLabels[0]) {
      this.highPay = parseInt(event)
    } else if (label === this.payLabels[1]) {
      this.lowPay = parseInt(event)
    } else if (label === this.payLabels[2]) {
      this.midPay = parseInt(event)
    }
  }

  updateCreditsState(label: string, event: string) {
    if (label === this.dependLabels[0]) {
      this.minorDepend = parseInt(event) * 2000
    } else if (label === this.dependLabels[1]) {
      this.nonMinorDepend = parseInt(event) * 500
    } else if (label === this.dependLabels[2]) {
      this.otherCredits = parseInt(event)
    }
    this.credits = this.minorDepend + this.nonMinorDepend + this.otherCredits
  }

  setNonJobAdjust(event: string) {
    this.nonJobAdjust = parseInt(event)
  }

  setDeductEst(event: string) {
    this.deductionEst = parseInt(event)
  }

  setOtherAdjust(event: string) {
    this.otherAdjusts = parseInt(event)
  }

  setGrossPay(event: string) {
    this.grossPay = parseInt(event)
  }
  // TODO: move this to some kind of service
 getAnnualWithholdingFromMultipleJobs(maritalStatus, highPay, selectedBracket) { // picks the coorect table and axis based on marital status and returns a table lookup on that table

  let axis;
  let relevantTaxTable;
  switch(maritalStatus) {
    case "married":
      axis = marriedAxis;
      relevantTaxTable = marriedTable;
      break;
    case "single":
      axis = singleAxis;
      relevantTaxTable = singleTable;
      break;
    case "head":
      axis = headAxis;
      relevantTaxTable = headTable;
      break;
    default:
      throw new Error("unknown marital status")
  }
    
    let higherBracket;
    for (let bracket of axis) {
      if (highPay >= bracket) {
        higherBracket = axis.indexOf(bracket);
      }
    }
    return relevantTaxTable[higherBracket][selectedBracket]
  }

  
  
  findMultiJobWithholdings(maritalStatus: string, highPay: number, lowPay: number, midPay: number) {
    let lowerBracket;
    let middleBracket;
    for (let bracket of lowerAxis) { // finds index of lower income and middle income (if applicable) on the table 
      if(lowPay >= bracket) {
        lowerBracket = lowerAxis.indexOf(bracket);
      }
      if (midPay && midPay >= bracket) {
        middleBracket = lowerAxis.indexOf(bracket)
      }
    }

    if (midPay) { // sets table result using midPay on the lowerAxis than adds middle pay to higher pay for the next time throught the table
      const middleBracketCalculation = this.getAnnualWithholdingFromMultipleJobs(maritalStatus, highPay, middleBracket)
      const lowerBracketCalculation = this.getAnnualWithholdingFromMultipleJobs(maritalStatus, midPay + highPay, lowerBracket)
      const tableResult = middleBracketCalculation + lowerBracketCalculation
      const multiJobWithholdings = Math.round(tableResult / this.payPeriods)
      this.multiJobWithholdings = multiJobWithholdings 
      return
    } else { // sets table result using lowPay 
       const lowerBracketCalculation = this.getAnnualWithholdingFromMultipleJobs(maritalStatus, highPay , lowerBracket)
       const multiJobWithholdings = Math.round(lowerBracketCalculation / this.payPeriods)
       this.multiJobWithholdings = multiJobWithholdings 
       return
    }
  }

  findDeductions() {
    if (this.maritalStatus === 'married') {
      this.deductionEst = Math.max(0, this.deductionEst - 25900)
    }
    if (this.maritalStatus === 'single') {
      this.deductionEst = Math.max(0, this.deductionEst - 19400)
    }
    if (this.maritalStatus === 'head') {
      this.deductionEst = Math.max(0, this.deductionEst - 12950)
    }
    this.deduction = this.deductionEst + this.otherAdjusts
  }

  getTableLine(adjPay) {
    let releventTable: number[][];
    let output: number[]
    if (!this.earnDifferent) {
      switch (this.maritalStatus) {
        case 'married':
          releventTable = marriedChecked;
          break;
        case 'single':
          releventTable = singleChecked
          break;
        case 'head':
          releventTable = headChecked
          break;
        default:
          throw new Error("unknown marital status")
      }
    } else {
      switch (this.maritalStatus) {
        case 'married':
          releventTable = marriedUnchecked;
          break;
        case 'single':
          releventTable = singleUnchecked
          break;
        case 'head':
          releventTable = headUnchecked
          break;
        default:
          throw new Error("unknown marital status")
      }
    }
    for (let line of releventTable) {
      if (adjPay > line[2]) {
        output = line;
      }
    } 

    return output;
  }

  findWithholdings () {
    // Step 1 calculate adjusted pay amount. If calculation is < 0 adjPay = 0
    let adjPay = (this.grossPay + (this.nonJobAdjust / this.payPeriods)) - (this.deduction / this.payPeriods) <= 0 ? 0 : (this.grossPay + (this.nonJobAdjust / this.payPeriods)) - (this.deduction / this.payPeriods);

    // step 2 find aplicable table and braket
    let tableLine:number[] = this.getTableLine(adjPay);
    
    //step 2, 3 and 4 calculate witholdings based on table items and credits. If calculation is < 0 fedIncomeTax = 0. add extra withholdings from w4 4c
    this.fedIncomeTax = Math.round((tableLine[0] + (((adjPay - tableLine[2]) * tableLine[1]) / 100)) - (this.credits / this.payPeriods) <= 0 + this.multiJobWithholdings? 0 : Math.round(tableLine[0] + (((adjPay - tableLine[2]) * tableLine[1]) / 100)) - (this.credits / this.payPeriods)) + this.multiJobWithholdings;
  
    // calculate SS
    this.socialSecurity = Math.round((this.grossPay * 620) / 10000);
    // calculate SS medicare
    this.medicare = Math.round(((this.grossPay * 145) + (Math.max(this.grossPay - 200000, 0) * 90)) / 10000);
  }

  finalCalc() {
    this.findMultiJobWithholdings(this.maritalStatus, this.highPay, this.lowPay, this.midPay)
    this.findDeductions()
    this.findWithholdings()
    this.calculated = true
  }


}
