# Shape Controls Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix shape orientation to flat-based rectangle, replace taper/pinch with trapeze+rotate, add width/height linking, reorder controls.

**Architecture:** Modify plankPts() pipeline: change n-gon angle offset for flat base, replace taper/pinch passes with trapeze (polarity-aware) and rotate. Update HTML sliders, presets, and all helper functions.

**Tech Stack:** Vanilla JS, single HTML file, no dependencies.

---

### Task 1: Update P defaults — remove ta/pp, add pz/pr/lk

**Files:** `iso-icon-generator.html:190`

Change `var P={...}`:
- Remove: `ta:0.25`, `pp:0`
- Add: `pz:0.25` (trapeze, replaces taper), `pr:0` (rotate), `lk:0` (link toggle)
- Keep all other params unchanged

### Task 2: Rewrite plankPts() — flat base, trapeze replaces taper, add rotate, remove pinch

**Files:** `iso-icon-generator.html:539-642`

Key changes inside plankPts:

**a) Remove taper from width calc (lines 546-552):**
Replace:
```js
var halfW=H*P.wd;
var narrowW=halfW*(1-P.ta);
...
var w1=(pol[nKey(q1,r1)]===1)?narrowW:halfW;
var w2=(pol[nKey(q2,r2)]===1)?narrowW:halfW;
```
With:
```js
var halfW=H*P.wd;
var halfL=H*P.ht;
if(halfL<2)halfL=2;
// Polarity flag for trapeze direction
var polNode1=pol[nKey(q1,r1)]===1;
```
(`w1`/`w2` no longer needed — trapeze handles this in the pipeline)

**b) Fix n-gon angle for flat base (line 572):**
Change: `var angle=2*Math.PI*i/n-Math.PI/2;`
To: `var angle=2*Math.PI*i/n-Math.PI/2+Math.PI/n;`

The `+Math.PI/n` rotates by half a sector so n=4 has flat bottom edge.

**c) Width interpolation — use uniform halfW (no w1/w2 taper):**
Change vertex generation to use `halfW` uniformly:
```js
verts.push([rawA*halfL, rawN*halfW]);
```

**d) Replace pinch pass with trapeze pass:**
Remove the pinch block (`if(P.pp!==0){...}`).
Add trapeze after skew, before point:
```js
// Apply trapeze (polarity-aware taper)
if(P.pz!==0){
  for(var i=0;i<verts.length;i++){
    var t=(verts[i][0]+halfL)/(2*halfL); // 0 at left, 1 at right
    var factor=polNode1 ? (1-P.pz*t) : (1-P.pz*(1-t));
    verts[i][1]*=factor;
  }
}
```

**e) Add rotate pass after indent (before convert to global):**
```js
// Apply rotate
if(P.pr!==0){
  var rad=P.pr*Math.PI/180;
  var cosR=Math.cos(rad),sinR=Math.sin(rad);
  var rcx=0,rcy=0;
  for(var i=0;i<verts.length;i++){rcx+=verts[i][0];rcy+=verts[i][1]}
  rcx/=verts.length;rcy/=verts.length;
  for(var i=0;i<verts.length;i++){
    var dx=verts[i][0]-rcx,dy=verts[i][1]-rcy;
    verts[i][0]=rcx+dx*cosR-dy*sinR;
    verts[i][1]=rcy+dx*sinR+dy*cosR;
  }
}
```

### Task 3: Update renderShapePreview() — same changes as plankPts

**Files:** `iso-icon-generator.html:783-826`

Mirror the plankPts changes:
- Fix angle offset: add `+Math.PI/n`
- Use uniform `halfW` (no taper-based w1/w2)
- Remove pinch pass, add trapeze pass (use polNode1=false for preview, showing the "default" direction)
- Add rotate pass after indent

### Task 4: Rewrite Shape section HTML — new control order, link toggle, remove taper/pinch, add trapeze/rotate

**Files:** `iso-icon-generator.html:104-136`

New section layout (between `<details class="section" open>` and `</details>`):
```
summary: Shape
section-desc: Piece shape and deformation
shapePreview div
Shape presets (psb)
Width slider (wd) + link button
Height slider (ht)
Sides slider (pn)
Trapeze slider (pz, 0-1, default 0.25)
Skew slider (pk)
Indent slider (pi)
Point slider (pe)
Rotate slider (pr, 0-360, step 1, default 0)
```

The link button: a small toggle between width label row and height, something like:
```html
<div style="text-align:right;margin:-6px 0 2px">
<button id="lkBtn" style="font-size:10px;padding:1px 6px;border:1px solid #ccc;background:#fff;border-radius:4px;cursor:pointer;color:#999" onclick="toggleLink()">link</button>
</div>
```

Width/Height oninput handlers must check `P.lk` and sync the other slider if linked.

### Task 5: Update SHAPE_PRESETS, syncShapeSliders, updBtns

**Files:** `iso-icon-generator.html:877-896, 834-865`

**SHAPE_PRESETS:** Remove `pp` from all entries, add `pz` and `pr`:
```js
var SHAPE_PRESETS=[
  {l:'bar',    pn:4,pk:0,pi:0,pe:0,pz:0,pr:0},
  {l:'diamond',pn:4,pk:0,pi:0,pe:1,pz:0,pr:0},
  {l:'hex',    pn:6,pk:0,pi:0,pe:0,pz:0,pr:0},
  {l:'arrow',  pn:3,pk:0,pi:0,pe:0.5,pz:0,pr:0},
  {l:'chevron',pn:4,pk:0,pi:-0.5,pe:0.5,pz:0,pr:0},
  {l:'hourglass',pn:4,pk:0,pi:0,pe:0,pz:0,pr:0}
];
```

**Button onclick:** set P.pn/pk/pi/pe/pz/pr from preset (no pp).

**syncShapeSliders:** Remove pp sync, add pz and pr sync.

**updBtns preset comparison:** Remove pp, compare pn/pk/pi/pe/pz/pr.

### Task 6: Add toggleLink() and linked slider logic

**Files:** `iso-icon-generator.html` (new function near other helpers)

```js
var _linkRatio=1;
function toggleLink(){
  P.lk=P.lk?0:1;
  if(P.lk) _linkRatio=P.wd/P.ht;
  $('lkBtn').style.background=P.lk?'var(--accent)':'#fff';
  $('lkBtn').style.color=P.lk?'#fff':'#999';
  $('lkBtn').style.borderColor=P.lk?'var(--accent)':'#ccc';
}
```

Width oninput: if P.lk, set P.ht=P.wd/_linkRatio, sync ht slider+readout.
Height oninput: if P.lk, set P.wd=P.ht*_linkRatio, sync wd slider+readout.

### Task 7: Update resetDefaults, copySeed, loadPreset

**resetDefaults:** Remove ta/pp from defaults, add pz:0.25/pr:0/lk:0. Remove ta/pp from slider sync, add pz/pr.

**copySeed:** Remove Pinch/Taper from output, add Trapeze/Rotate.

**loadPreset:** Backward compat: map old `ta` to `pz`, delete `ta`/`pp`. Remove pp from defaults check, add pz/pr defaults. Remove ta/pp from slider sync, add pz/pr.

### Task 8: Update log, verify

Add log entry. Verify in browser:
1. Default shape is flat-based rectangle (not diamond)
2. Width/Height link toggle works
3. Trapeze creates polarity-aware taper (alternating direction)
4. Rotate spins the piece shape
5. Presets all work
6. Shape preview reflects all changes
7. Reset returns to defaults
8. Old presets load correctly (ta→pz migration)
