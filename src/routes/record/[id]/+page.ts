import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

// ここだけSPAモードにする（内容をプリレンダリングできないため）.
export const prerender = false;
export const load = (({ params }) => {
  // idは[userId]-[recordId]になっているので, 正規表現で取得する
  const pattern = /(\w*)-(\w*)/g;
  const matched = pattern.exec(params.id);
  if (matched) {
    const userId = matched[1];
    const recordId = matched[2];
    return {
      userId,
      recordId,
    };
  } else {
    throw error(400, "Bad Request");
  }
}) satisfies PageLoad;
