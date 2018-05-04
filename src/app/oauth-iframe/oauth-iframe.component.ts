import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { IFrameHandle, IFrameResizer } from '../iframeresizer/IFrameResizer';
import { WINDOW } from '../window/window.service';

/**
 * @description
 *
 * An iframe to execute OAuth-flow in.
 *
 * The flow is initiated by the `requestUrl` parameter (note that the parameter
 * is honored only in `ngOnInit`, the component does not re-activate if the
 * parameter binding changes).
 *
 */
@Component({
    selector: 'xd-oauth-iframe'
  , template: `<iframe #oauth [ngClass]="classes"></iframe>`
})
export class OAuthIFrameComponent implements OnDestroy, OnInit
{
    @ViewChild('oauth') public iframeRef: ElementRef;

    /** CSS-classes to set to the `iframe`-element. */
    @Input() public classes: string;

    /** Request URL to start the OAuth-flow. */
    @Input() public requestUrl: string;

    /** Event emitted when the flow has been successfully completed. */
    @Output() public success = new EventEmitter<string>();

    private handle: IFrameHandle;
    private iframe: HTMLIFrameElement;

    /**
     * Constructs new instance.
     *
     * Takes in `window` and an optional `IFrameResizer`.
     * If `IFrameResizer` is not passed, the `iframe` is not automatically resized.
     * For the resizing to work, the IdP must have the other end of `iframe-resizer` in use.
     */
    constructor(
        @Inject(WINDOW) private readonly window: Window
      , @Optional() private readonly iFrameResizer: IFrameResizer
    ) {}

    public ngOnInit(): void
    {
        this.window.addEventListener('message', this.onReceiveMessage, false);
        this.iframe = this.iframeRef.nativeElement;
        this.iframe.src = this.requestUrl;

        if (this.iFrameResizer) {
            this.handle = this.iFrameResizer.init(this.iframe);
        }
    }

    public ngOnDestroy(): void
    {
        this.window.removeEventListener('message', this.onReceiveMessage);

        if (this.handle) {
            this.handle.close();
        }
    }

    public onReceiveMessage = (event: MessageEventInit) =>
    {
        if (this.window.location.origin === event.origin) {
            if (event.data && 'sso.success' === event.data.type) {
                this.success.emit(event.data.fragment);
            }
        }
    }

}
