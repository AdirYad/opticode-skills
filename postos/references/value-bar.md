# Value bar

The test of a post is whether the reader is better off for having read it. Most weak posts break no rule at all. They just say what the reader knew, or can't be used, or only report something. The analyst and strategist apply the first part when choosing topics; the writer and the reviewers apply the second part to drafts.

`contentMode` in `brand.json` sets what counts as fresh:
- **news**: a field where things launch and change. Fresh means released or substantially changed inside `noveltyWindowDays` (default 21), and the date can be verified.
- **evergreen**: a field with no launches, such as health, design or parenting. Fresh means the channel hasn't said it recently, it isn't what the first page of a search already says, and something real stands behind it: a client case, a study, a measured result, a question people truly ask.

## Three questions for a topic
A topic with a "no" on any of these is dropped. Two strong posts beat three with a weak one in the middle.

**1. Is it fresh?** Old features re-announced as this week's news are what ages a channel fastest. In news mode, being new to this audience isn't enough, because anyone can look it up and then the channel looks careless. When the date (news) or the source (evergreen) can't be confirmed, mark it `novelty: unconfirmed` and rank it low.

**2. Is there something most people would miss?** A particular trick, setting, sequence or insight beyond what the headline already said.
- Doesn't qualify: "אפשר לתמלל שיחות מכירה ולקבל סיכום."
- Qualifies: "מעלים שלוש שיחות שנסגרו ושלוש שלא ושואלים איזה משפט מופיע רק באלה שנסגרו."

If all there is to say is that a thing exists and does what its name says, look for a better angle or drop it.

**3. Can this audience use it soon?** The `audience` in `brand.json` decides. Something limited to certain plans can still work if the idea is worth it and the limit is stated.

## Four checks for a draft
1. **Is something possible tonight that wasn't this morning?** The exact wording, the exact place in the menu, the exact order of actions.
2. **Is the surprising part on the page?** Check it survived the writing and didn't turn into a general bullet.
3. **Could someone have written this without touching the thing?** Real names, real figures, stated limits. Invented results or statistics end the post.
4. **Is the shape earning its place?** An opener, three matching bullets and a moral is usually a sign that another shape from `references/post-formats.md` would carry this better.

## The difference in practice
Fails the checks:
> אפשר לתמלל שיחות מכירה ולקבל סיכום קצר. ככה יודעים מה הלקוח רצה ומה חשוב לשפר.

Passes them:
> מעלים הקלטות של שלוש שיחות שנסגרו ושלוש שלא וכותבים בדיוק ככה:
> תמצא משפט אחד שחוזר רק בשיחות שנסגרו ותגיד לי באיזו דקה הוא נאמר.
> שמות ומספרים בעברית הוא עדיין מבלבל, אז כל ציטוט בודקים מול ההקלטה.

The second one has a real procedure, the words to type, and says where it breaks.

## When there isn't enough
Don't write a weak post to reach a number. A dull post costs mutes and trust, while a missing one costs nothing. Tell the buyer: "מצאתי רק 2 נושאים ששווה לכתוב עליהם. אפשר 2 חזקים, או שאחפש עוד."
