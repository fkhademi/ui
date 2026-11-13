import type { ReactNode } from 'react';

/**
 * A card of settings, one row each, every row saving on its own. Use a
 * Drawer instead when the values only make sense saved together.
 *
 *   <SettingsList title="Registry">
 *     <SettingsRow title="Enabled" sub="For this tenant"><Toggle ... /></SettingsRow>
 *   </SettingsList>
 */
export function SettingsList({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <section className="settings-list">
      {title != null && <h2 className="settings-list-title">{title}</h2>}
      {children}
    </section>
  );
}

export function SettingsRow({
  title,
  sub,
  children,
}: {
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="settings-row">
      <div className="settings-row-text">
        <div className="settings-row-title">{title}</div>
        {sub != null && <div className="settings-row-sub">{sub}</div>}
      </div>
      {children != null && <div className="settings-row-control">{children}</div>}
    </div>
  );
}
