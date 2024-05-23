import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()

export class UserService{
    getData(){
        return[
            {
                id: 1000,
                name: 'James Butt',
                email: 'Benton, John B Jr',
                role: 'unqualified',
            },
            {
                id: 1001,
                name: 'Josephine Darakjy',
                email: 'Chanay, Jeffrey A Esq',
                role: 'proposal',
            },
            
        ]
    }
}