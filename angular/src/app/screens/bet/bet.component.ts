import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'
import { routesNames } from 'src/app/app-routing.module';

import { AuthService } from 'src/app/repository/authRepository';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit, AfterViewInit {
  // HTMLElements
  stockPriceElement!: HTMLElement;
  yourBet!: HTMLElement;
  timer!: HTMLElement;
  upButton!: HTMLElement;
  downButton!: HTMLElement;
  score!: HTMLElement;
  beginStat!: HTMLElement;
  endStat!: HTMLElement;
  iconStat!: HTMLElement;
  winLoose!: HTMLElement;

  myCanvas: any;
  btcChart: any;
  context: any;
  ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');

  // variable to control if bet is up or down 1 to up, 0 to down
  more: any = true;

  // variable to disable button bet when a bet already exists
  disabled = false;

  // variable to set loading
  loading = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private db: AngularFireDatabase,
  ) {
    // registering chart variables and elements
    Chart.register(LineController, CategoryScale, LineElement, PointElement, LinearScale, Title);
    // go to login if user is not logged
    if (!this.auth?.currentUser?.uid) {
      this.router.navigate(['login']);
    }
  }




  ngOnInit() {

    this.getHTMLElements()

    this.getUserData();

  }



  ngAfterViewInit() {

    this.createChart();

    let auxValue = '';

    // waiting messages from webSocket to update data in realtime
    this.ws.onmessage = (event: MessageEvent) => {
      let stockObject = JSON.parse(event.data);
      auxValue = parseFloat(stockObject?.p).toFixed(3)

      this.loading = false;
    }

    // setting 1 second interval to update chart every second
    setInterval(() => {
      this.stockPriceElement.innerText = auxValue;
      const datasets = this.btcChart.data.datasets;

      // if exists more than 10 dots in the chart, 
      // the other ones are shifted to out of canvas
      if (this.btcChart.data.labels.length > 10) {
        datasets[0].data.shift();
        !datasets[1].length ?? datasets[1].data.shift();
        this.btcChart.data.labels?.shift();
      };

      //setting value of new dot on chart
      datasets[0].data.push(auxValue);

      this.btcChart.data.labels?.push(this.getTimeString());

      // if exist bet
      if (this.yourBet.innerText.length) {

        // setting the first 10 dots when user do bet and dataset[1] does not have any data
        if (!datasets[1].data.length) {
          for (var i = 0; i < 10; i++) {
            datasets[1].data.push(Number(this.yourBet.innerText));
          }
        }
        // setting only one new dot on chart if exists dots on datasets[1]
        else {
          datasets[1].data.push(Number(this.yourBet.innerText));
        }
      }

      // the call that update chart
      this.btcChart.update();
    }, 1000);
  }

  // type = 1 if up
  // type = 0 if down
  bet(type: any) {
    // if stockprice is not initial value
    if (this.stockPriceElement.innerText.length) {
      // used to disable bet
      this.disabled = true;
      this.yourBet.innerText = this.stockPriceElement.innerText;

      // set color of bet button and also which arrow will be shown at actual bet
      if (type) {
        this.more = true;
        this.upButton.style.backgroundColor = '#97c93d';
      } else {
        this.more = false;
        this.downButton.style.backgroundColor = '#97c93d';
      }

      // analize win/loose and set Last Round Stats
      setTimeout(() => {
        this.disabled = false;
        this.upButton.style.backgroundColor = 'white'
        this.downButton.style.backgroundColor = 'white'

        const userBetInnerText = Number(this.yourBet.innerText);
        const stckPEInnerText = Number(this.stockPriceElement.innerText);


        // Setting lastBet
        this.db.object(`${this.auth.currentUser?.uid}/lastBet/beginStat`).set(this.yourBet.innerText);
        this.db.object(`${this.auth.currentUser?.uid}/lastBet/endStat`).set(this.stockPriceElement.innerText);
        this.db.object(`${this.auth.currentUser?.uid}/lastBet/iconStat`).set(type ? 'arrow_upward' : 'arrow_downward');

        const scr = Number(this.score.innerText);

        // setting score depending of situation
        if (userBetInnerText < stckPEInnerText && type) {

          this.db.object(`${this.auth.currentUser?.uid}`).update({ score: scr + 1 });

        } else if (userBetInnerText > stckPEInnerText && type) {

          this.db.object(`${this.auth.currentUser?.uid}`).update({ score: scr - 1 });

        } else if (userBetInnerText < stckPEInnerText && !type) {

          this.db.object(`${this.auth.currentUser?.uid}`).update({ score: scr - 1 });

        } else if (userBetInnerText > stckPEInnerText && !type) {

          this.db.object(`${this.auth.currentUser?.uid}`).update({ score: scr + 1 });

        }

        this.yourBet.innerText = '';

        this.btcChart.data.datasets[1].data = [];
      }, 60000)

      this.timer.innerText = '60';

      var timerInterval = setInterval(() => {
        // setting timer
        this.timer.innerText = String(Number(this.timer.innerText) - 1);

        const stckPEInnerText = Number(this.stockPriceElement.innerText);
        const userBetInnerText = Number(this.yourBet.innerText);

        // settingColor of Actual Bet and chart
        if (userBetInnerText < stckPEInnerText && type) {

          this.yourBet.style.color = 'green';
          this.btcChart.data.datasets[1].borderColor = 'green';

        } else if (userBetInnerText > stckPEInnerText && type) {

          this.yourBet.style.color = 'red';
          this.btcChart.data.datasets[1].borderColor = 'red';

        } else if (userBetInnerText < stckPEInnerText && !type) {

          this.yourBet.style.color = 'red';
          this.btcChart.data.datasets[1].borderColor = 'red';

        } else if (userBetInnerText > stckPEInnerText && !type) {

          this.yourBet.style.color = 'green';
          this.btcChart.data.datasets[1].borderColor = 'green';

        }

        // ending interval when 0
        if (Number(this.timer.innerText) == 0) {
          clearInterval(timerInterval);
        }
      }, 1000);
    }

  }

  getHTMLElements() {
    // setting HTMLElements
    this.stockPriceElement = document.getElementById('stock-price')!;
    this.yourBet = document.getElementById('your-bet')!;
    this.timer = document.getElementById('timer')!;
    this.upButton = document.getElementById('upButton')!;
    this.downButton = document.getElementById('downButton')!;
    this.score = document.getElementById('score')!;
    this.myCanvas = document.getElementById('myCanvas')!;
    this.beginStat = document.getElementById('beginStat')!;
    this.endStat = document.getElementById('endStat')!;
    this.iconStat = document.getElementById('iconStat')!;
    this.winLoose = document.getElementById('winLoose')!;
  }

  createChart() {
    // creating chart
    this.context = this.myCanvas.getContext('2d');
    this.btcChart = new Chart(this.myCanvas, {
      type: 'line',
      data: {
        labels: [],
        // one dataset to realtime cryptocurrency and other to the bet line
        datasets: [{
          borderWidth: 1,
          data: [],
        },
        {
          borderColor: 'green',
          borderWidth: 1,
          data: [],
        }]
      },
    })
  }

  getUserData() {
    // getting realtime data
    this.db
      .object(`${this.auth.currentUser?.uid}`)
      .valueChanges()
      .subscribe((val: any) => {
        this.beginStat.innerText = val.lastBet.beginStat;
        this.endStat.innerText = val.lastBet.endStat;
        this.iconStat.innerText = val.lastBet.iconStat;
        this.score.innerText = String(val.score);
        this.setWinLoose(this.beginStat, this.endStat, this.iconStat);
      });
  }

  // solve if last bet was win or loose 
  setWinLoose(beginStat: HTMLElement, endStat: HTMLElement, iconStat: HTMLElement) {

    const userBetInnerText = beginStat.innerText;
    const stckPEInnerText = endStat.innerText;

    if (beginStat.innerText > endStat.innerText && iconStat.innerText == 'arrow_upward') {

    }
    if (userBetInnerText < stckPEInnerText && iconStat.innerText == 'arrow_upward') {

      this.winLoose.innerText = 'Win';

    } else if (userBetInnerText > stckPEInnerText && iconStat.innerText == 'arrow_upward') {

      this.winLoose.innerText = 'Loose';

    } else if (userBetInnerText < stckPEInnerText && iconStat.innerText == 'arrow_downward') {

      this.winLoose.innerText = 'Loose';

    } else if (userBetInnerText > stckPEInnerText && iconStat.innerText == 'arrow_downward') {

      this.winLoose.innerText = 'Win';

    }
  }

  getTimeString() {

    // generating and setting time
    const actualDate = new Date()
    const timeString = `${actualDate.getHours()}:${actualDate.getMinutes()}:${actualDate.getSeconds()}`;
    return timeString;
  }

  logout() {
    // if user is betting
    if (!(Number(this.timer.innerText) > 0))
      this.auth.logout().then(() => {
        this.router.navigate([routesNames.LOGIN]);
      })
    else{
      this.auth.alerts.showErrorMessage(
        "Can't logout when betting."
    );
    }
  }



}
