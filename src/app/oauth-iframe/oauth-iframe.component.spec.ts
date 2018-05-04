import { ElementRef } from '@angular/core';

import { OAuthIFrameComponent } from './oauth-iframe.component';
import { IFrameHandle, IFrameResizer } from '../iframeresizer/IFrameResizer';

describe('SSOImplicitComponent', () =>
{
  let component: OAuthIFrameComponent;
  let wind0w: Window;
  let ref: ElementRef;
  let iframe: HTMLIFrameElement;
  let handle: IFrameHandle;

  beforeEach(() =>
  {
    const win: any = jasmine.createSpyObj('Window', ['addEventListener', 'removeEventListener']);
    win.location = {origin: 'https://example.com'};
    wind0w = win;

    iframe = {} as HTMLIFrameElement;
    ref = new ElementRef(iframe);
    handle = jasmine.createSpyObj('IFrameHandle', ['close']);
  });

  describe('with IFrameResizer', () =>
  {
    let resizer: any;

    beforeEach(() =>
    {
      resizer = jasmine.createSpyObj('IFrameResizer', ['init']);
      resizer.init.and.returnValue(handle);

      component = initComponent(wind0w, resizer);
    });

    it('should initialize', () =>
    {
        component.ngOnInit();

        expect(wind0w.addEventListener).toHaveBeenCalledTimes(1);
        expect(wind0w.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function), false);

        expect(iframe.src).toBe('http://localhost/');
        expect(resizer.init).toHaveBeenCalledTimes(1);
        expect(resizer.init).toHaveBeenCalledWith(iframe);
    });

    it('should clean on destroy', () =>
    {
        component.ngOnInit();
        component.ngOnDestroy();

        expect(wind0w.removeEventListener).toHaveBeenCalledTimes(1);
        expect(wind0w.removeEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));

        expect(handle.close).toHaveBeenCalledTimes(1);
    });
  });


  describe('without IFrameResizer', () =>
  {
    beforeEach(() =>
    {
      component = initComponent(wind0w, null);
    });

    it('should initialize', () =>
    {
        component.ngOnInit();

        expect(wind0w.addEventListener).toHaveBeenCalledTimes(1);
        expect(wind0w.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function), false);

        expect(iframe.src).toBe('http://localhost/');
    });

    it('should clean on destroy', () =>
    {
        component.ngOnInit();
        component.ngOnDestroy();

        expect(wind0w.removeEventListener).toHaveBeenCalledTimes(1);
        expect(wind0w.removeEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));
    });
  });


  describe('onReceiveMessage', () =>
  {
      beforeEach(() =>
      {
          component = initComponent(wind0w, null);
      });

      it('should emit fragment if origin and event type are correct', (done) =>
      {
          component.success.subscribe(result => {
              expect(result).toBe('#test-fragment');
              done();
          });
          component.onReceiveMessage({
              origin: 'https://example.com'
            , data: {
                  type: 'sso.success'
                , fragment: '#test-fragment'
              }
          });
      });

      it('should emit nothing if origin is incorrect', (done) =>
      {
          component.success.subscribe(result => {
              fail('Should not emit value');
          });
          component.onReceiveMessage({
              origin: 'http://evil-hijacker.com'
            , data: {type: 'sso.success'}
          });
          done();
      });

      it('should emit nothing if event data is missing', (done) =>
      {
          component.success.subscribe(result => {
              fail('Should not emit value');
          });
          component.onReceiveMessage({
              origin: 'https://example.com'
          });
          done();
      });
      it('should emit false if event data is string', (done) =>
      {
          component.success.subscribe(result => {
              fail('Should not emit value');
          });
          component.onReceiveMessage({
              origin: 'https://example.com'
            , data: 'some random data here'
          });
          done();
      });
      it('should emit false if event data is object without type', (done) =>
      {
          component.success.subscribe(result => {
              fail('Should not emit value');
          });
          component.onReceiveMessage({
              origin: 'https://example.com'
            , data: {hello: 'world'}
          });
          done();
      });
      it('should emit false if event data is object with improper type', (done) =>
      {
          component.success.subscribe(result => {
              fail('Should not emit value');
          });
          component.onReceiveMessage({
              origin: 'https://example.com'
            , data: {type: 'incorrect type'}
          });
          done();
      });
  });

  function initComponent(win: Window, resizer: any): OAuthIFrameComponent
  {
      const comp = new OAuthIFrameComponent(win, resizer as IFrameResizer);
      comp.requestUrl = 'http://localhost/';
      comp.iframeRef = ref;

      return comp;
  }

});

