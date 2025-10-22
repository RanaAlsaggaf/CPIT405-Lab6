function setCookie(name, value, days = 365) {
    const d = new Date(); d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}
function getCookie(name) {
    const needle = encodeURIComponent(name) + "=";
    return document.cookie.split("; ").reduce((acc, cur) => {
        if (cur.startsWith(needle)) { acc = decodeURIComponent(cur.slice(needle.length)); }
        return acc;
    }, "");
}
function deleteCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");
const likeCountEl = document.getElementById("likeCount");
const dislikeCountEl = document.getElementById("dislikeCount");
const lockHint = document.getElementById("lockHint");

const commentInput = document.getElementById("commentInput");
const submitComment = document.getElementById("submitComment");
const clearComment = document.getElementById("clearComment");
const commentsList = document.getElementById("commentsList");
const resetAll = document.getElementById("resetAll");
const toast = document.getElementById("toast");

const DEFAULT_LIKES = 100;
const DEFAULT_DISLIKES = 20;

const CK_VOTE = "lab6_vote";
const CK_LIKES = "lab6_likes";
const CK_DISLIKES = "lab6_dislikes";
const CK_COMMENT = "lab6_comment";

const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1600);
};

function updateButtonsLockedState() {
    const vote = getCookie(CK_VOTE);
    const commented = !!getCookie(CK_COMMENT);
    if (vote) {
        likeBtn.disabled = vote !== "like";
        dislikeBtn.disabled = vote !== "dislike";
        lockHint.textContent = `You voted “${vote}”. Use Reset to vote again.`;
    } else {
        likeBtn.disabled = false;
        dislikeBtn.disabled = false;
        lockHint.textContent = "";
    }
    submitComment.disabled = commented;
    if (commented) submitComment.title = "You already submitted a comment. Use Reset to clear.";
    else submitComment.title = "";
}

function renderCountsFromCookies() {
    const likes = parseInt(getCookie(CK_LIKES) || DEFAULT_LIKES, 10);
    const dislikes = parseInt(getCookie(CK_DISLIKES) || DEFAULT_DISLIKES, 10);
    likeCountEl.textContent = likes;
    dislikeCountEl.textContent = dislikes;
}

function renderCommentsFromCookie() {
    commentsList.innerHTML = "";
    const comment = getCookie(CK_COMMENT);
    if (comment) {
        const li = document.createElement("li");
        li.className = "comment";
        li.textContent = comment;
        commentsList.appendChild(li);
    }
}

function nudge(el) {
    el.animate([{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }],
        { duration: 140, easing: "ease-in-out" });
}

likeBtn.addEventListener("click", () => {
    const existing = getCookie(CK_VOTE);
    if (existing) { showToast("You already voted. Reset to vote again."); return; }
    const next = parseInt(getCookie(CK_LIKES) || DEFAULT_LIKES, 10) + 1;
    setCookie(CK_LIKES, next);
    setCookie(CK_VOTE, "like");
    renderCountsFromCookies();
    updateButtonsLockedState();
    nudge(likeBtn);
});

dislikeBtn.addEventListener("click", () => {
    const existing = getCookie(CK_VOTE);
    if (existing) { showToast("You already voted. Reset to vote again."); return; }
    const next = parseInt(getCookie(CK_DISLIKES) || DEFAULT_DISLIKES, 10) + 1;
    setCookie(CK_DISLIKES, next);
    setCookie(CK_VOTE, "dislike");
    renderCountsFromCookies();
    updateButtonsLockedState();
    nudge(dislikeBtn);
});

submitComment.addEventListener("click", () => {
    if (getCookie(CK_COMMENT)) {
        showToast("You already commented. Reset to comment again.");
        return;
    }
    const text = commentInput.value.trim();
    if (!text) { showToast("Write something first."); return; }
    setCookie(CK_COMMENT, text);
    commentInput.value = "";
    renderCommentsFromCookie();
    updateButtonsLockedState();
    showToast("Comment added!");
});

clearComment.addEventListener("click", () => {
    commentInput.value = "";
    commentInput.focus();
});

resetAll.addEventListener("click", () => {
    deleteCookie(CK_VOTE);
    deleteCookie(CK_COMMENT);
    setCookie(CK_LIKES, DEFAULT_LIKES);
    setCookie(CK_DISLIKES, DEFAULT_DISLIKES);
    renderCountsFromCookies();
    renderCommentsFromCookie();
    updateButtonsLockedState();
    showToast("Everything reset. You can vote & comment again.");
});

(function init() {
    if (!getCookie(CK_LIKES)) setCookie(CK_LIKES, DEFAULT_LIKES);
    if (!getCookie(CK_DISLIKES)) setCookie(CK_DISLIKES, DEFAULT_DISLIKES);

    renderCountsFromCookies();
    renderCommentsFromCookie();
    updateButtonsLockedState();
})();
