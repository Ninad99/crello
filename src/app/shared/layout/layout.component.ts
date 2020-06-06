import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isHandset$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map(result => result.matches));
  }
}
