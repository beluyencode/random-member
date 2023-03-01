import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'random-member';
  ColumnMode = ColumnMode;
  data: any = [];
  team: number = 1;
  minMale: number = 0;
  minFemale: number = 0;
  listTeamDivide: any = [];


  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get('assets/testData.json').subscribe((res: any) => {
      this.data = res;
    })
  }
  randomize(array: Array<any>) {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }

  // splitData(data: Array<any>, perChunk: number) {
  //   return data.reduce((resultArray, item, index) => {
  //     const chunkIndex = Math.floor(index / perChunk)

  //     if (!resultArray[chunkIndex]) {
  //       resultArray[chunkIndex] = [] // start a new chunk
  //     }

  //     resultArray[chunkIndex].push(item)

  //     return resultArray
  //   }, [])
  // }

  divideTeamClick() {
    this.listTeamDivide = this.divideTeam();
  }

  divideTeam() {
    let male = this.data.filter((ele: any) => ele.sex === 'Male');
    let female = this.data.filter((ele: any) => ele.sex === 'Female');
    let listTeam = Array(this.team).fill([]).map(() => {
      let returnValue = [
        ...male.slice(0, this.minMale),
        ...female.slice(0, this.minFemale)
      ]
      male = male.slice(this.minMale);
      female = female.slice(this.minFemale);

      return this.randomize(returnValue)
    })
    let remaining = this.randomize([
      ...male,
      ...female
    ]);
    // listTeam = listTeam.map((ele, index) => {
    //   return [
    //     ...ele,
    //     ...remaining[index]
    //   ]
    // })

    listTeam = listTeam.map(ele => {
      if (ele.length < (this.minMale + this.minFemale)) {
        let remainingfilter = remaining.slice(0, (this.minMale + this.minFemale) - ele.length);
        remaining = remaining.slice((this.minMale + this.minFemale) - ele.length);
        return [
          ...ele,
          ...remainingfilter
        ]
      }
      return ele;
    });


    console.log(remaining);
    console.log(listTeam);

    console.log(remaining);
    this.pushEqual(listTeam, remaining);
    console.log(listTeam);
    return listTeam;
  }

  pushEqual(array: any, arrayPush: any) {
    let index = 0;
    arrayPush.forEach((element: any) => {
      array[index].push(element);
      index += 1;
      if (index > array.length - 1) {
        index = 0;
      }
    });
  }

}
