/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BetComponent } from './bet.component';

describe('BetComponent', () => {
  let component: BetComponent;
  let fixture: ComponentFixture<BetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
