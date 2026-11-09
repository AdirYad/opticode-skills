# Stories playbook

How each mode runs, then the copy and visual rules that apply to all of them. The reasoning is in `references/method.md`.

## daily
The buyer receives a finished assignment worth 5 to 10 minutes of their day.

Starting defaults, which the buyer's own numbers replace once `stories/log.csv` has 30 rows:
- One frame. Two to four only when the format is a series. Five or more only in a launch.
- First frame in the morning before the workday, the frame with the reply ask around midday. Evenings only during a launch.
- A single frame can ask for a reply with no build-up, provided the reason to reply is on that same frame.

**The week.** Each day has a kind; the format comes from the matching group in `references/formats.md`.

| day | kind | how it ends |
|---|---|---|
| ראשון | answer | an open reply |
| שני | proof, from a new angle each week | soft |
| שלישי | take | reply word |
| רביעי | know | soft |
| חמישי | decide while an offer is open, otherwise rethink | reply word |
| שישי | take, a different kind from Tuesday's | reply word |
| שבת | know, short and light (dropped when `postOnShabbat` is false) | soft |

**A reason to reply doesn't have to be a guide.** Rotate: an old asset brought back, something tiny (one sentence, one checklist), the second half of a real story in DM, a look behind the scenes on request, one person's personal advice per week, a reply with just an emoji.

**Material.** Stories are built from something that happened. Take the first of these that exists:
1. Something the buyer says today. It goes in word for word.
2. Fresh proof: a client's message, a win, an answer from a question box.
3. Something the buyer posted elsewhere this week, retold for people who already know them.
4. The `seeds` list in `brand.json`.
5. News the audience can use today.
6. `stories/ideas.md`. Good ideas that weren't used today go back in.

**Output** in `stories/YYYY-MM-DD-daily/`: `task.md` in Hebrew and no longer than 10 lines (the idea, why today, the words of each frame, what to shoot or "מוכן, כבר רונדר", reply word, times), plus the frames, `sheet.png`, `schedule.json` and `POSTING.md`.

## ideas
Three to seven ideas, one for each kind of day, each with its opening line, format and material. Add them to `stories/ideas.md`.

## magnet
A free thing for a reply word. Use it on days that need reach.
1. Choose the thing by evidence: reply counts in `stories/log.csv`, questions that keep arriving, what's in `freeAssets`. Something new usually beats something reused.
2. Frame from `templates/magnet.html`: a blue box for the opening line (a figure or a painful question), a white box with what they get, a blue box with the ask. A real screenshot can go behind with `.full.dim`.
3. The reply word is the thing itself, one Hebrew word.
4. The file exists and the DM is connected before the story goes up (`references/reply-automation.md`).

## launch
A paid product, sold over 6 or 7 frames that follow the seven questions in `references/method.md` section 3, then question-and-answer frames with the reply word on the last one. One reply word for the entire launch. Facts only from what the buyer gave, and the buyer's own sentences stay untouched.

## qa
- Choose questions that remove a reason not to buy or increase the wanting. Anything else gets answered in DM.
- `.qc` holds the question exactly as it arrived, typos included, in the same place on every frame.
- The answer: a large blue box with the claim, plain lines with the detail, one closing box with an emoji that means something.
- Keep a list of who asked, and write to each of them privately.

## cta
One frame from `templates/cta.html`, up to three in a row: a strong opening box, plain lines running down the frame, the reply word in a box at the bottom. No tables and no graphic bullets. It should look like it was typed on the phone a minute ago.

## log
See step 7 of the pipeline in `SKILL.md`.

## Copy rules
- Frame 1 has a text opening line, always. Emoji sit at the end of a line.
- Short lines. A frame can hold more words if they're spread down the screen; what it can't hold is a dense block.
- Address follows `brand.json` `address`. Frames speak to a crowd, so the default is plural (תגיבו, לכם). If the buyer sets `singular`, change the formats accordingly.
- No dashes of any kind. Straight quotes only: `"`.
- Things that look real beat things that look designed: true screenshots, true lists of replies, true question cards.
- A follower's words appear only as a **screenshot of their own message**, never retyped into a box. Names and faces are covered with a marker scribble.
- Space carries meaning. A line continuing a sentence stays tight: one `.plain` with `<br>`, or a `.grp`. A line that sets up the next one gets a small gap (40 to 50). A new thought gets a large gap (100 to 120).
- A deadline points at something that exists ("ברגע שהטיימר בדף נגמר") and is never a made-up date.
- The whole copy is shown as plain text and agreed with the buyer before anything is rendered.

## Visual rules
The renderer checks what can be checked (`lib/README.md`). Black background. Native Instagram text boxes, blue or white, Rubik 600, joined with concave corners. Everything inside the safe area 64/250/340. Text never covers a face: a person goes in a `.shot.face` card with no border, and tilted only as a deliberate collage. Around two boxes plus plain lines per frame. Take the time to choose a photo that flatters the person.

## When the buyer can't film
Text frames alone are enough. Beyond that: screenshots clients sent, screenshots of the work, photos from the buyer's phone. A stock photo never passes for a real one.
