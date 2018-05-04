import { iframeResizer, IFrameComponent, IFrameObject } from 'iframe-resizer';
import { Injectable } from '@angular/core';

export interface IFrameHandle
{
    close(): void;
}

class IFrameHandleImpl implements IFrameHandle
{

    constructor(private readonly iframeObject: IFrameObject) {}

    close(): void
    {
        this.iframeObject.close();
    }
}

/**
 * @description
 *
 * Wrapper over iframe-resizer.
 */
@Injectable()
export class IFrameResizer
{
    init(target: HTMLIFrameElement): IFrameHandle
    {
        iframeResizer({checkOrigin: false, heightCalculationMethod: 'taggedElement'}, target);

        return new IFrameHandleImpl((target as IFrameComponent).iFrameResizer);
    }
}
