"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
	enNav,
	isActive,
	isEn,
	primaryNav,
	secondaryNav,
	showApplyCta,
} from "@/lib/nav";
import { site, TBD } from "@/site.config";
import { Arrow, ButtonLink } from "./Button";
import { Wordmark } from "./Wordmark";

const navLink =
	"relative py-1.5 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-stamp after:transition-transform hover:after:scale-x-100 aria-[current=page]:after:scale-x-100";

export function Masthead() {
	const pathname = usePathname();
	const en = isEn(pathname);
	const cta = showApplyCta(pathname) && !en;
	const nav = en ? enNav : primaryNav;
	return (
		<header className="sticky top-0 z-50 border-b border-line bg-ink-0/92 backdrop-blur-md">
			<div className="mx-auto flex h-[58px] max-w-[1280px] items-center gap-3 px-5 md:h-[68px] md:gap-10 md:px-8 xl:px-12">
				<Link
					href={en ? "/en" : "/"}
					className="flex min-h-11 shrink-0 items-center gap-3.5"
					aria-label={en ? "0xInChain home" : "0xInChain 链上情报局 首页"}
				>
					<Wordmark className="h-[17px] w-auto md:h-5" title="0xInChain" />
					<span className="hidden border-l border-line pl-3.5 font-serif-zh text-[15px] font-bold tracking-[0.12em] lg:inline">
						{site.nameZh}
					</span>
				</Link>
				<nav
					aria-label={en ? "Primary" : "主导航"}
					className="ml-auto hidden md:block"
				>
					<ul className="flex gap-6 font-serif-zh text-[15px] font-medium tracking-[0.06em] lg:gap-8">
						{nav.map((item) =>
							item.external ? (
								<li key={item.href}>
									<a
										href={item.href}
										target="_blank"
										rel="noopener noreferrer"
										className={`${navLink} text-bone-dim`}
									>
										{item.label} <Arrow>↗</Arrow>
									</a>
								</li>
							) : (
								<li key={item.href}>
									<Link
										href={item.href}
										className={navLink}
										aria-current={isActive(item, pathname) ? "page" : undefined}
									>
										{item.label}
									</Link>
								</li>
							),
						)}
					</ul>
				</nav>
				<Link
					href={en ? "/" : "/en"}
					lang={en ? "zh-CN" : "en"}
					className="hidden font-mono text-xs tracking-[0.1em] text-bone-dim underline-offset-4 hover:text-bone hover:underline md:inline"
				>
					{en ? "中文" : "EN"}
				</Link>
				{en ? (
					<ButtonLink
						href={site.social.x}
						external
						size="sm"
						className="max-md:ml-auto max-md:min-h-11 max-md:px-3 max-md:py-0 max-md:text-[13px]"
					>
						Follow on X <Arrow>↗</Arrow>
					</ButtonLink>
				) : cta ? (
					<ButtonLink
						href="/join"
						size="sm"
						className="max-md:ml-auto max-md:min-h-11 max-md:px-3 max-md:py-0 max-md:text-[13px]"
					>
						申请加入
					</ButtonLink>
				) : (
					<span className="ml-auto md:hidden" />
				)}
				<MobileMenu pathname={pathname} cta={cta} en={en} />
			</div>
		</header>
	);
}

function MobileMenu({
	pathname,
	cta,
	en,
}: {
	pathname: string;
	cta: boolean;
	en: boolean;
}) {
	const ref = useRef<HTMLDialogElement>(null);
	const close = () => ref.current?.close();

	// Close when navigation completes (covers back/forward too).
	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname change is the trigger
	useEffect(() => {
		ref.current?.close();
	}, [pathname]);

	const telegram = site.social.telegram === TBD ? null : site.social.telegram;

	return (
		<>
			<button
				type="button"
				onClick={() => ref.current?.showModal()}
				aria-haspopup="dialog"
				className="-mr-2.5 inline-flex size-11 items-center justify-center font-mono text-xs tracking-[0.1em] md:hidden"
			>
				菜单
			</button>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: native <dialog> already closes on Esc; this only adds backdrop clicks */}
			<dialog
				ref={ref}
				aria-label="菜单"
				className="m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-ink-0 text-bone backdrop:bg-black/60 open:flex open:flex-col"
				onClick={(e) => {
					if (e.target === e.currentTarget) close();
				}}
			>
				<div className="flex h-[58px] items-center justify-between border-b border-line px-5">
					<span className="font-mono text-[11px] tracking-[0.14em] text-dossier">
						MENU
					</span>
					<button
						type="button"
						onClick={close}
						className="-mr-2.5 inline-flex size-11 items-center justify-center font-mono text-xs tracking-[0.1em]"
					>
						关闭
					</button>
				</div>
				<nav
					aria-label="移动端导航"
					className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 py-8"
				>
					<ul className="space-y-4 font-serif-zh text-3xl font-bold tracking-[0.06em]">
						{(en ? enNav : primaryNav)
							.filter((i) => !i.external)
							.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={close}
										aria-current={isActive(item, pathname) ? "page" : undefined}
										className="aria-[current=page]:text-stamp"
									>
										{item.label}
									</Link>
								</li>
							))}
					</ul>
					<ul className="space-y-3 border-t border-line pt-6 text-base text-bone-dim empty:hidden">
						{(en ? [] : secondaryNav).map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									onClick={close}
									className="hover:text-bone"
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
					<ul className="flex gap-6 font-mono text-sm text-bone-dim">
						<li>
							<a
								href={site.social.x}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-bone"
							>
								X <Arrow>↗</Arrow>
							</a>
						</li>
						{telegram ? (
							<li>
								<a
									href={telegram}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-bone"
								>
									Telegram <Arrow>↗</Arrow>
								</a>
							</li>
						) : null}
						<li className="ml-auto">
							<Link
								href={pathname.startsWith("/en") ? "/" : "/en"}
								onClick={close}
								className="hover:text-bone"
							>
								{pathname.startsWith("/en") ? "中文" : "EN"}
							</Link>
						</li>
					</ul>
				</nav>
				{cta ? (
					<div className="border-t border-line p-5 pb-[calc(20px+env(safe-area-inset-bottom))]">
						<ButtonLink href="/join" className="w-full justify-center">
							申请加入 <Arrow />
						</ButtonLink>
					</div>
				) : null}
			</dialog>
		</>
	);
}
