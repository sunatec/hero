"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
	type FormEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import {
	CAPITAL,
	capitalLabel,
	MARKETS,
	MESSAGE_MAX,
	marketLabel,
	SOURCES,
	sourceLabel,
	YEARS,
	yearsLabel,
} from "@/lib/schema/apply-options";

type TurnstileApi = {
	render: (el: HTMLElement, opts: Record<string, unknown>) => string;
	reset: (id?: string) => void;
	remove: (id?: string) => void;
};
declare global {
	interface Window {
		turnstile?: TurnstileApi;
	}
}

const TURNSTILE_SRC =
	"https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const legendCls = "mb-3 font-mono text-[11px] tracking-[0.12em] text-dossier";
const optionCls =
	"flex min-h-11 cursor-pointer items-center gap-2.5 rounded-file border border-line px-3.5 text-[15px] transition-colors hover:border-bone-dim has-checked:border-dossier has-checked:bg-ink-1 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-stamp";
const inputCls =
	"min-h-11 w-full rounded-file border border-line bg-ink-1 px-3.5 text-base text-bone placeholder:text-bone-dim/70 aria-invalid:border-stamp";

function ErrorText({ id, msg }: { id: string; msg?: string }) {
	return msg ? (
		<p id={id} className="mt-2 mb-0 text-sm text-stamp">
			{msg}
		</p>
	) : null;
}

function Group({
	name,
	legend,
	hint,
	required,
	error,
	children,
}: {
	name: string;
	legend: string;
	hint?: string;
	required?: boolean;
	error?: string;
	children: ReactNode;
}) {
	const errId = `${name}-error`;
	return (
		<fieldset
			className="m-0 min-w-0 border-0 p-0"
			aria-describedby={error ? errId : undefined}
			aria-invalid={error ? true : undefined}
		>
			<legend className={legendCls}>
				{legend}
				{required ? (
					<span aria-hidden="true"> *</span>
				) : (
					<span className="text-bone-dim">（选填）</span>
				)}
			</legend>
			{hint ? <p className="-mt-1 mb-3 text-sm text-bone-dim">{hint}</p> : null}
			<div className="flex flex-wrap gap-2">{children}</div>
			<ErrorText id={errId} msg={error} />
		</fieldset>
	);
}

type Props = {
	modules: { slug: string; label: string }[];
	waitlist: boolean;
	siteKey?: string;
	tgHandle: string;
};

/** /join form — fields and copy: docs/copy/join.md. Validation shared with /api/apply. */
export function JoinForm({ modules, waitlist, siteKey, tgHandle }: Props) {
	const router = useRouter();
	const formId = useId();
	const widgetRef = useRef<HTMLDivElement>(null);
	const widgetId = useRef<string | null>(null);
	const [token, setToken] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [state, setState] = useState<"idle" | "sending" | "failed">("idle");
	const [msgLen, setMsgLen] = useState(0);
	const summaryRef = useRef<HTMLDivElement>(null);

	const renderWidget = useCallback(() => {
		if (!siteKey || !widgetRef.current || !window.turnstile || widgetId.current)
			return;
		widgetId.current = window.turnstile.render(widgetRef.current, {
			sitekey: siteKey,
			theme: "dark",
			language: "zh-cn",
			callback: (t: string) => {
				setToken(t);
				setErrors(({ turnstileToken: _, ...rest }) => rest);
			},
			"expired-callback": () => setToken(""),
			"error-callback": () => setToken(""),
		});
	}, [siteKey]);

	useEffect(() => {
		renderWidget();
		return () => {
			if (widgetId.current) window.turnstile?.remove(widgetId.current);
			widgetId.current = null;
		};
	}, [renderWidget]);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const input = {
			handle: String(fd.get("handle") ?? ""),
			years: fd.get("years") ?? undefined,
			markets: fd.getAll("markets"),
			modules: fd.getAll("modules"),
			capital: fd.get("capital") || undefined,
			source: fd.get("source") ?? undefined,
			message: String(fd.get("message") ?? ""),
			agree: fd.get("agree") === "on",
			turnstileToken: token,
			waitlist,
		};
		// The schema (zod/mini) loads on first submit, keeping it out of the page's initial JS.
		const { ApplicationInput, fieldErrors } = await import(
			"@/lib/schema/apply"
		);
		const parsed = ApplicationInput.safeParse(input);
		if (!parsed.success) {
			setErrors(fieldErrors(parsed.error));
			requestAnimationFrame(() => summaryRef.current?.focus());
			return;
		}
		setErrors({});
		setState("sending");
		try {
			const res = await fetch("/api/apply", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(input),
			});
			if (res.ok) {
				router.push("/join/submitted");
				return;
			}
			const body = (await res.json().catch(() => ({}))) as {
				error?: string;
				fields?: Record<string, string>;
			};
			if (res.status === 400 && body.fields) {
				setErrors(body.fields);
				setState("idle");
				requestAnimationFrame(() => summaryRef.current?.focus());
				return;
			}
			if (res.status === 403) {
				setErrors({ turnstileToken: "验证未通过，请刷新后重试" });
				setToken("");
				if (widgetId.current) window.turnstile?.reset(widgetId.current);
				setState("idle");
				return;
			}
			setState("failed");
		} catch {
			setState("failed");
		}
	}

	const err = (k: string) => errors[k];
	const errorCount = Object.keys(errors).length;
	const sending = state === "sending";

	if (!siteKey) {
		return (
			<div className="rounded-file border border-line bg-ink-1 p-6">
				<p className="m-0">
					在线申请暂未开放。请直接私信官方 TG：
					<b className="font-medium">{tgHandle}</b>（先在
					<Link href="/verify" className="tap underline underline-offset-4">
						官方渠道验证
					</Link>
					页核对账号）。
				</p>
			</div>
		);
	}

	return (
		<form
			id={formId}
			noValidate
			onSubmit={onSubmit}
			className="flex flex-col gap-9"
			aria-label="申请表"
		>
			<Script
				src={TURNSTILE_SRC}
				strategy="afterInteractive"
				onReady={renderWidget}
			/>
			<div
				ref={summaryRef}
				tabIndex={-1}
				aria-live="assertive"
				className="outline-none empty:hidden"
			>
				{errorCount > 0 ? (
					<p className="m-0 rounded-file border border-stamp px-4 py-3 text-sm text-stamp">
						有 {errorCount} 处需要修改，请查看下方标红的项目。
					</p>
				) : null}
			</div>

			<div>
				<label htmlFor="handle" className={`${legendCls} block`}>
					TG 用户名<span aria-hidden="true"> *</span>
				</label>
				<input
					id="handle"
					name="handle"
					autoComplete="off"
					spellCheck={false}
					placeholder="@your_handle"
					required
					aria-invalid={err("handle") ? true : undefined}
					aria-describedby={err("handle") ? "handle-error" : undefined}
					className={`${inputCls} max-w-[22em] font-mono`}
				/>
				<ErrorText id="handle-error" msg={err("handle")} />
			</div>

			<Group name="years" legend="交易年限" required error={err("years")}>
				{YEARS.map((y) => (
					<label key={y} className={optionCls}>
						<input
							type="radio"
							name="years"
							value={y}
							className="accent-dossier"
						/>
						{yearsLabel[y]}
					</label>
				))}
			</Group>

			<Group
				name="markets"
				legend="主要市场"
				hint="可多选"
				required
				error={err("markets")}
			>
				{MARKETS.map((m) => (
					<label key={m} className={optionCls}>
						<input
							type="checkbox"
							name="markets"
							value={m}
							className="accent-dossier"
						/>
						{marketLabel[m]}
					</label>
				))}
			</Group>

			<Group name="modules" legend="最关注的模块" hint="可多选">
				{modules.map((m) => (
					<label key={m.slug} className={optionCls}>
						<input
							type="checkbox"
							name="modules"
							value={m.slug}
							className="accent-dossier"
						/>
						{m.label}
					</label>
				))}
			</Group>

			<Group name="capital" legend="资金区间" hint="仅用于匹配服务，可以不填">
				{CAPITAL.map((c) => (
					<label key={c} className={optionCls}>
						<input
							type="radio"
							name="capital"
							value={c}
							className="accent-dossier"
						/>
						{capitalLabel[c]}
					</label>
				))}
			</Group>

			<Group
				name="source"
				legend="从哪里了解到我们"
				required
				error={err("source")}
			>
				{SOURCES.map((s) => (
					<label key={s} className={optionCls}>
						<input
							type="radio"
							name="source"
							value={s}
							className="accent-dossier"
						/>
						{sourceLabel[s]}
					</label>
				))}
			</Group>

			<div>
				<label htmlFor="message" className={`${legendCls} block`}>
					想说的话<span className="text-bone-dim">（选填）</span>
				</label>
				<textarea
					id="message"
					name="message"
					rows={4}
					maxLength={MESSAGE_MAX}
					onChange={(e) => setMsgLen(e.target.value.length)}
					placeholder="你目前的交易方式，或想从情报室得到什么"
					aria-invalid={err("message") ? true : undefined}
					aria-describedby="message-count"
					className={`${inputCls} py-3 leading-relaxed`}
				/>
				<p
					id="message-count"
					className="mt-1 mb-0 text-right font-mono text-xs text-bone-dim"
				>
					{msgLen} / {MESSAGE_MAX}
				</p>
				<ErrorText id="message-error" msg={err("message")} />
			</div>

			<div>
				<label className="flex cursor-pointer items-start gap-3 text-[15px] leading-relaxed">
					<input
						type="checkbox"
						name="agree"
						required
						aria-invalid={err("agree") ? true : undefined}
						aria-describedby={err("agree") ? "agree-error" : undefined}
						className="mt-1.5 size-4 shrink-0 accent-dossier"
					/>
					<span>
						我已阅读并理解
						<Link
							href="/legal/risk"
							target="_blank"
							className="mx-0.5 tap underline underline-offset-4"
						>
							风险披露
						</Link>
						与
						<Link
							href="/legal/terms"
							target="_blank"
							className="mx-0.5 tap underline underline-offset-4"
						>
							服务条款
						</Link>
						，包括不退款政策
					</span>
				</label>
				<ErrorText id="agree-error" msg={err("agree")} />
			</div>

			<div>
				<div ref={widgetRef} className="min-h-[65px]" />
				<ErrorText id="turnstileToken-error" msg={err("turnstileToken")} />
			</div>

			<div className="flex flex-col gap-4">
				<button
					type="submit"
					disabled={sending}
					className="inline-flex min-h-12 items-center justify-center gap-2.5 self-start rounded-file bg-stamp-fill px-7 font-medium tracking-[0.06em] text-bone transition-colors hover:bg-stamp-fill-hover disabled:cursor-wait disabled:opacity-70 max-md:w-full"
				>
					{sending ? "提交中…" : waitlist ? "提交候补申请" : "提交申请"}
				</button>
				<div aria-live="polite">
					{state === "failed" ? (
						<p className="m-0 rounded-file border border-stamp px-4 py-3 text-sm">
							提交没有成功，请稍后再试。如果多次失败，也可以直接联系官方 TG：
							<b className="font-medium">{tgHandle}</b>
						</p>
					) : null}
				</div>
				<p className="m-0 text-[13px] leading-relaxed text-bone-dim">
					你的回答只会发送给管理员的
					TG，本站不存储。我们不会收集钱包地址或身份信息。
					<Link
						href="/legal/privacy"
						className="ml-1 tap underline underline-offset-4"
					>
						隐私说明 →
					</Link>
				</p>
			</div>
		</form>
	);
}
