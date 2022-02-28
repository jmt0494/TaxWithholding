import { Component, OnInit } from '@angular/core';

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
    earnDifferent: boolean = true; //step 2 box c
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

  updateCeditsState(label: string, event: string) {
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

  findMultiJobWithholdings(maritalStatus: string, highPay: number, lowPay: number, midPay: number) {
    const lowerAxis = [
      0, 10000, 20000, 30000,
      40000, 50000, 60000,
      70000, 80000, 90000,
      100000, 110000
    ];
    const marriedAxis = [
      0, 10000, 20000, 30000,
      40000, 50000, 60000,
      70000, 80000, 90000,
      100000, 150000, 240000,
      260000, 280000, 300000,
      320000, 365000, 525000
    ];
    const singleAxis = [
      0, 10000, 20000, 30000,
      40000, 60000, 80000,
      100000, 125000, 150000,
      175000, 200000, 250000,
      400000, 450000
    ];
    const headAxis = [
      0, 10000, 20000, 30000,
      40000, 60000, 80000,
      100000, 125000, 150000,
      175000, 200000, 450000 
    ];
    const marriedTable = [
      [0, 110, 850, 860, 1020, 1020, 1020, 1020, 1020, 1020, 1770, 1870],
      [110, 1110, 1860, 2060, 2220, 2220, 2220, 2220, 2220, 2970, 3970, 4070],
      [850, 1860, 2800, 3000, 3160, 3160, 3160, 3160, 3910, 4910, 5910, 6010],
      [860, 2060, 3000, 3200, 3360, 3360, 3360, 4110, 5110, 6110, 7110, 7210],
      [1020, 2220, 3160, 3360, 3520, 3520, 4270, 5270, 6270, 7270, 8270, 8370],
      [1020, 2220, 3160, 3360, 3520, 4270, 5270, 6270, 7270, 8270, 9270, 9370],
      [1020, 2220, 3160, 3360, 4270, 5270, 6270, 7270, 8270, 9270, 10270, 10370],
      [1020, 2220, 3160, 4110, 5270, 6270, 7270, 8270, 9270, 10270, 11270, 11370],
      [1020, 2820, 4760, 5960, 7120, 8120, 9120, 10120, 11120, 12120, 13150, 13450],
      [1870, 4070, 6010, 7210, 8370, 9370, 10510, 11710, 12910, 14110, 15310, 15600],
      [2040, 4440, 6580, 7980, 9340, 10540, 11740, 12940, 14140, 15340, 16540, 16830],
      [2040, 4440, 6580, 7980, 9340, 10540, 11740, 12940, 14140, 15340, 16540, 17590],
      [2040, 4440, 6580, 7980, 9340, 10540, 11740, 12940, 14140, 16100, 18100, 19190],
      [2040, 4440, 6580, 7980, 9340, 10540, 11740, 13700, 15700, 17700, 19700, 20790],
      [2040, 4440, 6580, 7980, 9340, 11300, 13300, 15300, 17300, 19300, 21300, 22390],
      [2100, 5300, 8240, 10440, 12600, 14600, 16600, 18600, 20600, 22600, 24870, 26260],
      [2970, 6470, 9710, 12210, 14670, 16970, 19270, 21570, 23870, 26170, 28470, 29870],
      [3140, 6840, 10280, 12980, 15640, 18140, 20640, 23140, 25640, 28140, 30640, 32240],
    ];
    const singleTable = [
      [400, 930, 1020, 1020, 1250, 1870, 1870, 1870, 1870, 1970, 2040, 2040],
      [930, 1570, 1660, 1890, 2890, 3510, 3510, 3510, 3610, 3810, 3880, 3880],
      [1020, 1660, 1990, 2990, 3990, 4610, 4610, 4710, 4910, 5110, 5180, 5180],
      [1020, 1890, 2990, 3990, 4990, 5610, 5710, 5910, 6110, 6310, 6380, 6380],
      [1870, 3510, 4610, 5610, 6680, 7500, 7700, 7900, 8100, 8300, 8370, 8370],
      [1870, 3510, 4680, 5880, 7080, 7900, 8100, 8300, 8500, 8700, 8970, 9770],
      [1940, 3780, 5080, 6280, 7480, 8300, 8500, 8700, 9100, 10100, 10970, 11770],
      [2040, 3880, 5180, 6380, 7580, 8400, 9140, 10140, 11140, 12140, 13040, 14140],
      [2040, 3880, 5180, 6520, 8520, 10140, 11140, 12140, 13320, 14620, 15790, 16890],
      [2040, 4420, 6520, 8520, 10520 ,12170, 13470, 14770, 16070, 17370, 18540, 19640],
      [2720, 5360, 7460, 9630, 11930 ,13860, 15160, 16460, 17760, 19060, 20230, 21330],
      [2970, 5920, 8310, 10610, 12910 ,14840, 16140, 17440, 18740, 20040, 21210, 22310],
      [2970, 5920, 8310, 10610, 12910 ,14840, 16140, 17440, 18740, 20040, 21210, 22310],
      [2970, 5920, 8310, 10610, 12910 ,14840, 16140, 17440, 18740, 20040, 21210, 22470],
      [3140, 6290, 8880, 11380, 13880 ,16010, 17510, 19010, 20510, 22010, 23380, 24680],
    ];
    const headTable = [
      [0, 760, 910, 1020, 1020, 1020, 1190, 1870, 1870, 1870, 2040, 2040],
      [760, 1820, 2110, 2220, 2220, 2390, 3390, 4070, 4070, 4240, 4440, 4440],
      [910, 2110, 2400, 2510, 2680, 3680, 4680, 5360, 5530, 5730, 5930, 5930],
      [1020, 2220, 2510, 2790, 3790, 4790, 5790, 6640, 6840, 7040, 7240, 7240],
      [1020, 2240, 3530, 4640, 5640, 6780, 7980, 8860, 9060, 9260, 9460, 9460],
      [1870, 4070, 5360, 6610, 7810, 9010, 10210, 11090, 11290, 11490, 11690, 12170],
      [1870, 4210, 5700, 7010, 8210, 9410, 10610, 11490, 11690, 12380, 13370, 14170],
      [2040, 4440, 5930, 7240, 8440, 9640, 10860, 12540, 13540, 14540, 15540, 16480],
      [2040, 4440, 5930, 7240, 8860, 10860, 12860, 14540, 15540, 16830, 18130, 19230],
      [2040, 4460, 6750, 8860, 10860, 12860, 15000, 16980, 18280, 19580, 20880, 21980],
      [2720, 5920, 8210, 10320, 12600, 14900, 17200, 19180, 20480, 21780, 23080, 24180],
      [2970, 6470, 9060, 11480, 13780, 16080, 18380, 20360, 21660, 22960, 24250, 25360],
      [3140, 6840, 9630, 12250, 14750, 17250, 19750, 21930, 23430, 24930, 26420, 27730],
    ];

    let lowerBracket: number = 0;
    let middleBracket: number = 0;
    let higherBracket: number = 0;
    let tableResult: number = 0
    
    for (let bracket of lowerAxis) { // finds index of lower income and middle income (if aplicable) on the table 
      if(lowPay >= bracket) {
        lowerBracket = lowerAxis.indexOf(bracket);
      }
      if (midPay && midPay >= bracket) {
        middleBracket = lowerAxis.indexOf(bracket)
      }
    }

    if (midPay) { // sets table result using midPay on the lowerAxis than adds middle pay to higher pay for the next time throught the table
      if (maritalStatus === 'married') {
        for (let bracket of marriedAxis) {
          if (highPay >= bracket) {
            higherBracket = marriedAxis.indexOf(bracket);
          }
        }
        tableResult = marriedTable[higherBracket][middleBracket]
      }
  
      if (maritalStatus === 'single') {
        for (let bracket of singleAxis) {
          if (highPay >= bracket) {
            higherBracket = singleAxis.indexOf(bracket);
          }
        }
        tableResult = singleTable[higherBracket][middleBracket]
      }
  
      if (maritalStatus === 'head') {
        for (let bracket of headAxis) {
          if (highPay >= bracket) {
            higherBracket = headAxis.indexOf(bracket);
          }
        }
        tableResult = headTable[higherBracket][middleBracket]
      }
      highPay += midPay
    }

    if (maritalStatus === 'married') { // sets tableResult based on a married status
      for (let bracket of marriedAxis) {
        if (highPay >= bracket) {
          higherBracket = marriedAxis.indexOf(bracket);
        }
      }
      tableResult += marriedTable[higherBracket][lowerBracket]
    }

    if (maritalStatus === 'single') { // sets tableResult based on a single status
      for (let bracket of singleAxis) {
        if (highPay >= bracket) {
          higherBracket = singleAxis.indexOf(bracket);
        }
      }
      tableResult += singleTable[higherBracket][lowerBracket]
    }

    if (maritalStatus === 'head') { // sets tableResult based on a head status
      for (let bracket of headAxis) {
        if (highPay >= bracket) {
          higherBracket = headAxis.indexOf(bracket);
        }
      }
      tableResult += headTable[higherBracket][lowerBracket]
    }

    this.multiJobWithholdings = Math.round(tableResult / this.payPeriods)
    
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
    if(!this.deduction) {
      this.deduction = 0
    }
  }

  findWithholdings () {
    
    const marriedChecked = [
      //[withhold cents, percent above, bottom of bracket]
      [0, 0, 0],
      [0, 10, 241],
      [ 19.20, 12, 433],
      [89.76, 22, 1021],
      [283.58, 24, 1902],
      [646.22, 32, 3413],
      [920.14, 35, 4269],
      [1625.04, 37, 6283]
    ]
    
    const singleChecked = [
      [0, 0, 0],
      [0, 10, 121],
      [9.50, 12, 216],
      [44.78, 22, 510],
      [141.80, 24, 951],
      [323.00, 32, 1706],
      [459.96, 35, 2134],
      [1517.31, 37, 5155]
    ]

    const headChecked = [
      [0, 0, 0],
      [0, 10, 181],
      [3.60, 12, 317],
      [59.80, 22, 702],
      [127.78, 24, 1011],
      [308.98, 32, 1766],
      [445.94, 35, 2194],
      [1503.29, 37, 5215],
    ]

    const marriedUnchecked = [
      [0, 0, 0],
      [0, 10, 483],
      [38.20, 12, 865],
      [179.32, 22, 2041],
      [567.40, 24, 3805],
      [1292.44, 32, 6826],
      [1840.28, 35, 8538],
      [3249.73, 37, 12565]
    ]

    const singleUnchecked = [
      [0, 0, 0],
      [0, 10, 241],
      [19.20, 12, 433],
      [89.76, 22, 1021],
      [283.58, 24, 1902],
      [646.22, 32, 3413],
      [920.14, 35, 4269],
      [3034.84, 37, 10311]
    ]

    const headUnchecked = [
      [0, 0, 0],
      [0, 10, 362],
      [27.30, 12, 635],
      [119.58, 22, 1404],
      [255.54, 24, 2022],
      [618.18, 32, 3533],
      [891.78, 35, 4388],
      [3006.83, 37, 10431]
    ]


    // Step 1 calculate adjusted pay amount. If calculation is < 0 adjPay = 0
    let adjPay = (this.grossPay + (this.nonJobAdjust / this.payPeriods)) - (this.deduction / this.payPeriods) <= 0 ? 0 : (this.grossPay + (this.nonJobAdjust / this.payPeriods)) - (this.deduction / this.payPeriods);

    // step 2 find aplicable table and braket
    let tableLine:number[] = [];
    if (!this.earnDifferent) {
      if (this.maritalStatus === 'married') {
        for (let line of marriedChecked) {
          if (adjPay > line[2]) {
            tableLine = line
          }
        }
      }
      if (this.maritalStatus === 'single') {
        for (let line of singleChecked) {
          if (adjPay > line[2]) {
            tableLine = line
          }
        }
      }
      if (this.maritalStatus === 'head') {
        for (let line of headChecked) {
          if (adjPay > line[2]) {
            tableLine = line
          }
        }
      }
    } else {
      if (this.maritalStatus === 'married') {
        for (let line of marriedUnchecked) {
          if (adjPay > line[2]) {
            tableLine = line
          }
        }
      }
      if (this.maritalStatus === 'single') {
        for (let line of singleUnchecked) {
          if (adjPay > line[2]) {
            tableLine = line
          }
        }
      }
      if (this.maritalStatus === 'head') {
        for (let line of headUnchecked) {
          if (adjPay > line[2]) {
            tableLine = line
          }
        }
      }
    }
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
