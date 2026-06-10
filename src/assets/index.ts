import logo from './nflying-logo.png';
import seunghyub from './poca-seunghyub.jpeg';
import hoon from './poca-hoon.jpeg';
import jaehyun from './poca-jaehyun.jpeg';
import hweseung from './poca-hweseung.jpeg';
import dongsung from './poca-dongsung.jpeg';

export const LOGO = logo;

// 멤버별 샘플 포카 이미지 (실제 프로덕션에서는 Supabase Storage URL로 대체)
export const MEMBER_IMG: Record<string, string> = {
  승협: seunghyub,
  훈: hoon,
  재현: jaehyun,
  회승: hweseung,
  동성: dongsung,
};
