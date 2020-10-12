import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

import { DxDataGridModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true
})
export class AppComponent {
    ordersStore: any = [];

    constructor(private http: HttpClient) {
        this.ordersStore = AspNetData.createStore({
            key: 'OrderID',
            loadUrl: `${URL}/Orders`,
            onBeforeSend: function (method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        });
    }

    onSaving(e: any) {
        e.cancel = true;

        if (e.changes.length) {
            e.promise = this.processBatchRequest(`${URL}/Batch`, e.changes, e.component);
        }
    }

    async processBatchRequest(url: string, changes: any, component: any): Promise<any> {
        await this.http.post(url, JSON.stringify(changes), {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }).toPromise();
        await component.refresh()
        await component.cancelEditData();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        HttpClientModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);