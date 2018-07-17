import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { SbifService } from '../service/sbifservice';
import { Uf } from '../domain/uf';
import { Dollar } from '../domain/dollar';
import { Tmc } from '../domain/tmc';
import { TmcDataGraph } from '../domain/tmcdatagraph';
import { BreadcrumbService } from '../../breadcrumb.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    templateUrl: './home.component.html',
    styles: [`
        .ui-dataview .search-icon {
            margin-top: 3em;
        }

        .ui-dataview .filter-container {
            text-align: center;
        }

        @media (max-width: 40em) {
            .ui-dataview .car-details, .ui-dataview .search-icon{
                text-align: center;
                margin-top: 0;
            }

            .ui-dataview .filter-contai
            ner {
                text-align: left;
            }
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

    fromDate: Date;

    toDate: Date;

    msgs: Message[] = [];

    ufchart: any;

    dollarchart: any;

    tmcchart: any;

    tmcchartdummy: any;

    ufs: Uf[];

    ufCols: any[];

    dollars: Dollar[];

    tmcs: Tmc[];

    // Left sides

    ufAverage: number;

    maxUf: number;

    minUf: number;

    dollarAverage: number;

    maxDollar: number;

    minDollar: number;

    unsubscribe: Subject<any> = new Subject();


    constructor(private sbifService: SbifService, private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Cumplo' },
            { label: 'Home', routerLink: ['/home'] }
        ]);
    }

    ngOnInit() {
        this.ufCols = [
            { field: 'Fecha', header: 'Fecha' },
            { field: 'Valor', header: 'Valor' },
        ];
    }

    onSortChange(event) {
        const value = event.value;
    }

    generateReport() {
        this.makeMagic(this.fromDate.getDate(), this.fromDate.getMonth() + 1, this.fromDate.getFullYear(), this.toDate.getDate(), this.toDate.getMonth() + 1, this.toDate.getFullYear())
    }

    private populateTmc(comma: RegExp, dot: string) {
        var tmcLabels: string[] = new Array;
        var tmcDataList: TmcDataGraph[] = new Array;
        let map = new Map<string, TmcDataGraph>();
        if (this.tmcs != null) {
            for (let entry of this.tmcs) {
                if (!tmcLabels.includes(entry.Fecha)) {
                    tmcLabels.push(entry.Fecha);
                }
                if (!map.has(entry.Tipo)) {
                    var tmcData: TmcDataGraph = new TmcDataGraph(entry.SubTitulo);
                    tmcData.data.push(Number(entry.Valor.replace(comma, dot)));
                    map.set(entry.Tipo, tmcData);
                }
                else {
                    map.get(entry.Tipo).data.push(Number(entry.Valor.replace(comma, dot)));
                }
            }

            map.forEach((value: TmcDataGraph, key: string) => {
                tmcDataList.push(value);
            });

            // FIXME Many iterations
            // Paint max values.
            for (var _j = 0; _j < tmcDataList.length; _j++) {
                tmcDataList[_j].backgroundColor = [];
            }

            for (var _i = 0; _i < tmcLabels.length; _i++) {
                var maximo = 0;

                for (var _j = 0; _j < tmcDataList.length; _j++) {
                    if(Number(tmcDataList[_j].data[_i]) > maximo){
                        maximo = Number(tmcDataList[_j].data[_i])
                    }
                }

                for (var _k = 0; _k < tmcDataList.length; _k++) {
                    if(Number(tmcDataList[_k].data[_i]) == maximo){
                        tmcDataList[_k].backgroundColor.push('#00ba68')
                    } else {
                        tmcDataList[_k].backgroundColor.push('#eeeeee')
                    }
                }
            }
        }

        return { tmcLabels, tmcDataList };
    }

    private populateDollar(comma: RegExp, dot: string, minDollar: number) {
        var dollarHeaders: string[] = new Array;
        var dollarValues: number[] = new Array;
        var sumDollar: number = 0;
        if (this.dollars != null) {
            for (let entry of this.dollars) {
                let dollarValue = Number(entry.Valor.replace(comma, dot));
                dollarHeaders.push(entry.Fecha);
                dollarValues.push(dollarValue);
                sumDollar = sumDollar + dollarValue;
                if (dollarValue > this.maxDollar) {
                    this.maxDollar = dollarValue;
                }
                if (dollarValue < minDollar) {
                    minDollar = dollarValue;
                }
            }
            this.dollarAverage = sumDollar / this.dollars.length;
            this.minDollar = minDollar;
        }
        return { dollarHeaders, dollarValues, minDollar };
    }

    private populateUf(dot: string, comma: RegExp, minUf: number) {
        var ufHeaders: string[] = new Array;
        var ufValues: number[] = new Array;
        var sumUf: number = 0;
        if (this.ufs != null) {
            for (let entry of this.ufs) {
                let ufValue = Number(entry.Valor.replace(dot, '').replace(comma, dot));
                ufHeaders.push(entry.Fecha);
                ufValues.push(ufValue);
                sumUf = sumUf + ufValue;
                if (ufValue > this.maxUf) {
                    this.maxUf = ufValue;
                }
                if (ufValue < minUf) {
                    minUf = ufValue;
                }
            }
            this.ufAverage = sumUf / this.ufs.length;
            this.minUf = minUf;
        }
        return { ufHeaders, ufValues, minUf };
    }

    makeMagic(day, month, year, day2, month2, year2) {
        let comma = /\,/gi;
        let pcomma = /\;/gi;
        let dot = '.';
        this.maxUf = 0
        this.maxDollar = 0
        let minUf = 1000000000000
        let minDollar = 1000000000000

        this.sbifService.getUfs(this.fromDate.getDate(), this.fromDate.getMonth() + 1, this.fromDate.getFullYear(), this.toDate.getDate(), this.toDate.getMonth() + 1, this.toDate.getFullYear()).takeUntil(this.unsubscribe).subscribe(response => {
            this.ufs = response;

            var ufHeaders: string[] | undefined;
            var ufValues: number[] | undefined;
            ({ ufHeaders, ufValues, minUf } = this.populateUf(dot, comma, minUf));

            this.ufchart = this.makeUFChart(ufHeaders, ufValues);

            this.sbifService.getDollars(this.fromDate.getDate(), this.fromDate.getMonth() + 1, this.fromDate.getFullYear(), this.toDate.getDate(), this.toDate.getMonth() + 1, this.toDate.getFullYear()).takeUntil(this.unsubscribe).subscribe(response => {
                this.dollars = response;
    
                var dollarHeaders: string[] | undefined;
                var dollarValues: number[] | undefined;
                ({ dollarHeaders, dollarValues, minDollar } = this.populateDollar(comma, dot, minDollar));
    
                this.dollarchart = this.makeDollarChart(dollarHeaders, dollarValues)

                this.sbifService.getTmcs(this.fromDate.getDate(), this.fromDate.getMonth() + 1, this.fromDate.getFullYear(), this.toDate.getDate(), this.toDate.getMonth() + 1, this.toDate.getFullYear()).takeUntil(this.unsubscribe).subscribe(response => {
                    this.tmcs = response;
                    var { tmcLabels, tmcDataList }: { tmcLabels: string[]; tmcDataList: TmcDataGraph[]; } = this.populateTmc(comma, dot);

                    this.tmcchartdummy = this.makeTmcDummyChart()
                    this.tmcchart = this.makeTmcChart(tmcLabels, tmcDataList)

                    this.msgs.push({ severity: 'info', summary: '', detail: 'Done' });
                })
            })
            
        })
    }

    makeUFChart(ufHeaders, ufValues) {
        return {
            labels: ufHeaders,
            datasets: [
                {
                    label: 'Valor de la UF',
                    borderColor: '#3b454e',
                    backgroundColor: '#9CCC65',
                    data: ufValues,
                    fill: false
                }
            ]
        }
    }

    makeDollarChart(dollarHeaders, dollarValues) {
        return {
            labels: dollarHeaders,
            datasets: [
                {
                    label: 'Valor del dolar',
                    borderColor: '#3b454e',
                    backgroundColor: '#ffbf2a',
                    data: dollarValues,
                    fill: false
                }
            ]
        }
    }

    makeTmcChart(tmcLabels, tmcDataList) {
        console.log(tmcDataList)

        return {
            labels: tmcLabels,
            datasets: tmcDataList
        }
    }

    // TMC Dummy
    makeTmcDummyChart() {
        return {
            labels: ['2018-07-14', '2018-06-14'],
            datasets: [
                {
                    label: 'Label1',
                    backgroundColor: ['#42A5F5', '#eeeeee'],
                    data: [1, 2]
                },
                {
                    label: 'Label2',
                    backgroundColor: ['#42A5F5', '#eeeeee'],
                    data: [3, 4]
                },
                {
                    label: 'Label3',
                    backgroundColor: ['#42A5F5', '#eeeeee'],
                    data: [5, 6]
                },
                {
                    label: 'Label4',
                    backgroundColor: ['#42A5F5', '#eeeeee'],
                    data: [7, 8]
                }
            ]
        }
    }
}
