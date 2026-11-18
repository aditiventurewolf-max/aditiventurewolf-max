"""Generates the Unobvious background pack: grainy, soft-focus light fields.
Each plate is a few large light sources on a dark (or paper) ground, blurred in
a wide gamut, then given film grain. Deterministic: same seed, same image.
Run: python3 src/make_backgrounds.py  (writes assets/media/bg/*.webp)"""
import numpy as np, pathlib
from PIL import Image
OUT=pathlib.Path(__file__).resolve().parent.parent/'assets'/'media'/'bg';OUT.mkdir(parents=True,exist_ok=True)
W,H=2000,1250
def hexrgb(h):h=h.lstrip('#');return np.array([int(h[i:i+2],16) for i in (0,2,4)],float)/255
def lin(c):return np.where(c<=.04045,c/12.92,((c+.055)/1.055)**2.4)
def srgb(c):return np.where(c<=.0031308,c*12.92,1.055*np.power(np.clip(c,0,None),1/2.4)-.055)
def plate(name,ground,lights,grain=.055,seed=1,vignette=.35,size=None):
    global W,H
    W,H=size or (2000,1250)
    yy,xx=np.mgrid[0:H,0:W].astype(np.float32);xx/=W;yy/=H
    rng=np.random.default_rng(seed)
    img=np.ones((H,W,3),np.float32)*lin(hexrgb(ground))
    for L in lights:
        col=lin(hexrgb(L['c']));cx,cy=L['x'],L['y'];rx,ry=L['rx'],L['ry'];a=L.get('a',1.0);ang=L.get('rot',0)
        dx,dy=xx-cx,(yy-cy)*H/W
        if ang:ca,sa=np.cos(ang),np.sin(ang);dx,dy=dx*ca+dy*sa,-dx*sa+dy*ca
        d=np.sqrt((dx/rx)**2+(dy/ry)**2)
        if L.get('ring'):m=np.exp(-((d-1)/L['ring'])**2)       # a rim of light, like an eclipse
        else:m=np.exp(-(d**2)*1.6)                              # a soft pool of light
        img+= (col[None,None,:]-img)*(m*a)[...,None] if L.get('mode')=='paint' else col[None,None,:]*(m*a)[...,None]
    if vignette:v=1-vignette*np.clip(np.sqrt((xx-.5)**2+(yy-.5)**2)*1.25,0,1)**2;img*=v[...,None]
    out=srgb(np.clip(img,0,1))
    g=rng.normal(0,1,(H,W)).astype(np.float32)                   # luminance grain, slightly chunky
    g=(g+np.roll(g,1,0)+np.roll(g,1,1))/3
    out=np.clip(out+g[...,None]*grain,0,1)
    Image.fromarray((out*255).astype(np.uint8)).save(OUT/f'{name}.webp','WEBP',quality=70,method=6)
    Image.fromarray((out*255).astype(np.uint8)).resize((480,round(480*H/W))).save(OUT/f'{name}-thumb.webp','WEBP',quality=80)
    print(name)
N='#13181B';D='#0B1E33'
plate('amber-eclipse',N,[dict(c='#003A6C',x=.66,y=.55,rx=.5,ry=.5,a=.75),dict(c='#FFBF65',x=.6,y=.5,rx=.26,ry=.26,ring=.1,a=.95,rot=0),dict(c='#FD8973',x=.56,y=.56,rx=.27,ry=.27,ring=.16,a=.6),dict(c='#13181B',x=.63,y=.48,rx=.25,ry=.25,a=1,mode='paint')],seed=2)
plate('amber-horizon',N,[dict(c='#003A6C',x=.5,y=.1,rx=.9,ry=.35,a=.7),dict(c='#FD8973',x=.35,y=1.0,rx=.55,ry=.28,a=.75),dict(c='#FFBF65',x=.7,y=1.05,rx=.45,ry=.22,a=.8)],seed=3)
plate('amber-wave',N,[dict(c='#FFBF65',x=.75,y=.25,rx=.55,ry=.12,rot=-.35,a=.85),dict(c='#FD8973',x=.62,y=.38,rx=.5,ry=.1,rot=-.35,a=.6),dict(c='#003A6C',x=.25,y=.7,rx=.5,ry=.4,a=.85)],seed=4)
plate('amber-window',N,[dict(c='#0B4C86',x=.3,y=.45,rx=.18,ry=.42,a=.9),dict(c='#FFBF65',x=.6,y=.55,rx=.12,ry=.4,a=.85),dict(c='#FD8973',x=.7,y=.5,rx=.1,ry=.42,a=.7)],seed=5)
plate('paper-glow','#F0EEEB',[dict(c='#FD8973',x=.85,y=.15,rx=.4,ry=.4,a=.55,mode='paint'),dict(c='#FFBF65',x=.75,y=.35,rx=.3,ry=.3,a=.35,mode='paint'),dict(c='#CCD5DA',x=.1,y=.9,rx=.5,ry=.4,a=.5,mode='paint')],grain=.04,seed=6,vignette=0)
plate('cinema-veil','#151515',[dict(c='#AA1F23',x=.3,y=.55,rx=.5,ry=.45,a=.9),dict(c='#EE2324',x=.72,y=.48,rx=.08,ry=.4,a=.75),dict(c='#EDE1D3',x=.9,y=.4,rx=.2,ry=.5,a=.12)],seed=7)
plate('halo',N,[dict(c='#003A6C',x=.5,y=.5,rx=.62,ry=.62,a=.6),dict(c='#FFBF65',x=.5,y=.5,rx=.3,ry=.3,ring=.1,a=.95),dict(c='#FD8973',x=.46,y=.55,rx=.31,ry=.31,ring=.17,a=.55),dict(c='#13181B',x=.52,y=.48,rx=.29,ry=.29,a=1,mode='paint')],seed=8,size=(1400,1400),vignette=.6)
plate('halo-cinema','#151515',[dict(c='#5A1416',x=.5,y=.5,rx=.62,ry=.62,a=.6),dict(c='#EE2324',x=.5,y=.5,rx=.3,ry=.3,ring=.1,a=.9),dict(c='#AA1F23',x=.46,y=.55,rx=.31,ry=.31,ring=.17,a=.6),dict(c='#151515',x=.52,y=.48,rx=.29,ry=.29,a=1,mode='paint')],seed=9,size=(1400,1400),vignette=.6)
