import { Action, NgxsModule, State, StateContext, Store } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { TestBed } from '@angular/core/testing';

import { ReduxDevtoolsMockConnector } from './utils/redux-connector';
import { createReduxDevtoolsExtension } from './utils/create-devtools';
import { Injectable } from '@angular/core';

describe('[TEST]: Devtools with custom settings', () => {
  let store: Store;

  class TestActionPayload {
    public static readonly type = 'TestActionPayload';
    constructor(public action: string) {}
  }

  @State({
    name: 'count',
    defaults: 0
  })
  @Injectable()
  class CountState {
    @Action({ type: 'increment' })
    increment(ctx: StateContext<number>) {
      ctx.setState(state => state + 1);
    }

    @Action(TestActionPayload)
    actionPayload(ctx: StateContext<number>) {
      ctx.setState(state => state + 1);
    }
  }

  it('should be disable devtools', () => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([CountState]),
        NgxsReduxDevtoolsPluginModule.forRoot({ disabled: true })
      ]
    });

    store = TestBed.inject(Store);
    store.dispatch({ type: 'increment' });
    expect(store.snapshot()).toEqual({ count: 1 });
  });

  it('should be check custom name', () => {
    const devtools = new ReduxDevtoolsMockConnector();
    createReduxDevtoolsExtension(devtools);

    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([CountState]),
        NgxsReduxDevtoolsPluginModule.forRoot({ name: 'custom', maxAge: 1000 })
      ]
    });

    store = TestBed.inject(Store);

    expect(devtools.options).toEqual({ name: 'custom', maxAge: 1000 });
  });

  describe('actionSanitizer', () => {
    it('should call actionSanitizer', () => {
      const actionSanitizerFn = jest.fn();
      TestBed.configureTestingModule({
        imports: [
          NgxsModule.forRoot([CountState]),
          NgxsReduxDevtoolsPluginModule.forRoot({
            actionSanitizer: actionSanitizerFn
          })
        ]
      });
      store = TestBed.inject(Store);

      store.dispatch(new TestActionPayload('test'));
      expect(actionSanitizerFn).toHaveBeenCalled();
    });

    it('should sanitize action before sending to devtools', () => {
      const devtools = new ReduxDevtoolsMockConnector();
      createReduxDevtoolsExtension(devtools);
      TestBed.configureTestingModule({
        imports: [
          NgxsModule.forRoot([CountState]),
          NgxsReduxDevtoolsPluginModule.forRoot({
            actionSanitizer: action => ({
              ...action,
              action: null
            })
          })
        ]
      });
      store = TestBed.inject(Store);

      const spy = spyOn(devtools, 'send');
      store.dispatch(new TestActionPayload('test'));
      expect(spy).toHaveBeenCalledWith(
        {
          action: null,
          type: 'TestActionPayload'
        },
        {
          count: 1
        }
      );
    });

    it('should work when actionSanitizer is empty', () => {
      const devtools = new ReduxDevtoolsMockConnector();
      createReduxDevtoolsExtension(devtools);
      TestBed.configureTestingModule({
        imports: [NgxsModule.forRoot([CountState]), NgxsReduxDevtoolsPluginModule.forRoot()]
      });
      store = TestBed.inject(Store);

      const spy = spyOn(devtools, 'send');
      store.dispatch(new TestActionPayload('test'));
      expect(spy).toHaveBeenCalledWith(
        {
          action: 'test',
          type: 'TestActionPayload'
        },
        {
          count: 1
        }
      );

      store.dispatch({ type: 'increment' });
      expect(spy).toHaveBeenCalledWith(
        {
          type: 'increment'
        },
        {
          count: 2
        }
      );
    });
  });
});
