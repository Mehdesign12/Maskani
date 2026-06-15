'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  Check,
  Globe,
  Handshake,
  KeyRound,
  Laptop,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Smartphone,
  Sofa,
  User,
  UserPlus,
  Wallet,
} from 'lucide-react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { StatusPill } from '@/components/admin/StatusPill'
import { Toggle } from '@/components/admin/Toggle'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import { ADMIN_USERS, ROLE_LABELS } from '@/lib/admin/mock-users'
import { USER_STATUS_TONES } from '@/lib/admin/status-colors'
import { formatDate, formatRelativeTime } from '@/lib/admin/format'
import type { AdminUser } from '@/lib/admin/types'

type Tab = 'profil' | 'plateforme' | 'notifications' | 'securite' | 'equipe'

const TABS: { id: Tab; label: string }[] = [
  { id: 'profil', label: 'Profil' },
  { id: 'plateforme', label: 'Plateforme' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'securite', label: 'Sécurité' },
  { id: 'equipe', label: 'Équipe' },
]

function TabNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="flex w-full gap-1 overflow-x-auto rounded-[14px] border border-[#ebebeb] bg-white p-1.5">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTab(t.id)}
          className={[
            'flex-1 whitespace-nowrap rounded-[10px] px-4 py-2 text-[13px] font-semibold transition-colors',
            tab === t.id ? 'bg-[#222222] text-white' : 'text-[#6a6a6a] hover:bg-[#f7f7f7]',
          ].join(' ')}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

function Field({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-[#6a6a6a]">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-[14px] border border-[#ebebeb] bg-[#fafafa] px-4 py-2.5 text-[13px] text-[#222222] focus:border-[#D9BB9C] focus:outline-none"
      />
    </label>
  )
}

function SaveButton({ onSave }: { onSave?: () => void }) {
  const [saved, setSaved] = useState(false)

  return (
    <button
      type="button"
      onClick={() => {
        onSave?.()
        setSaved(true)
        setTimeout(() => setSaved(false), 1800)
      }}
      className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#222222] px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
    >
      {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
      {saved ? 'Enregistré' : 'Enregistrer'}
    </button>
  )
}

function ProfilTab() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.pravatar.cc/150?img=12" alt="Admin Maskani" className="h-20 w-20 rounded-full object-cover" />
          <div className="mt-3 flex items-center gap-1.5">
            <p className="text-[15px] font-bold text-[#222222]">Admin Maskani</p>
            <BadgeCheck className="h-4 w-4 text-[#4F6AE8]" />
          </div>
          <p className="text-[12px] text-[#888888]">admin@maskani.ma</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-[4px] bg-[#FFFBEB] px-2.5 py-1 text-[11px] font-semibold text-[#B45309]">
            <ShieldCheck className="h-3 w-3" /> Super Admin
          </span>
          <button
            type="button"
            className="mt-4 w-full rounded-[8px] border border-[#dddddd] py-2 text-[13px] font-semibold text-[#222222] transition-colors hover:bg-[#fafafa]"
          >
            Changer la photo
          </button>
        </div>
      </div>

      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Informations personnelles</h3>
          <p className="mt-0.5 text-[12px] text-[#888888]">Ces informations sont visibles par l&apos;équipe ModPass</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nom complet" defaultValue="Admin Maskani" />
            <Field label="Fonction" defaultValue="Super Administrateur" />
            <Field label="Email" defaultValue="admin@maskani.ma" type="email" />
            <Field label="Téléphone" defaultValue="+212 6 00 00 00 00" type="tel" />
          </div>
          <div className="mt-5">
            <SaveButton />
          </div>
        </div>

        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Préférences</h3>
          <div className="mt-4 space-y-4">
            <Toggle checked label="Notifications par email" description="Recevoir un résumé quotidien de l'activité" onChange={() => {}} />
            <Toggle checked={false} label="Mode sombre" description="Afficher le back-office en thème sombre" onChange={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}

function PlateformeTab() {
  const verticals = [
    { key: 'immobilier', label: 'Immobilier', icon: Building2, color: '#B19272', enabled: true },
    { key: 'ameublement', label: 'Ameublement', icon: Sofa, color: '#16A34A', enabled: true },
    { key: 'prestataires', label: 'Prestataires', icon: Handshake, color: '#4F6AE8', enabled: true },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Informations générales</h3>
          <p className="mt-0.5 text-[12px] text-[#888888]">Identité de la plateforme Maskani</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nom de la plateforme" defaultValue="Maskani" />
            <Field label="Email support" defaultValue="support@maskani.ma" type="email" />
            <Field label="Téléphone support" defaultValue="+212 5 22 00 00 00" type="tel" />
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold text-[#6a6a6a]">Devise par défaut</span>
              <select className="w-full rounded-[14px] border border-[#ebebeb] bg-[#fafafa] px-4 py-2.5 text-[13px] text-[#222222] focus:border-[#D9BB9C] focus:outline-none">
                <option>MAD — Dirham marocain</option>
                <option>EUR — Euro</option>
                <option>USD — Dollar américain</option>
              </select>
            </label>
          </div>
          <div className="mt-5">
            <SaveButton />
          </div>
        </div>

        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Verticals actives</h3>
          <p className="mt-0.5 text-[12px] text-[#888888]">Activez ou désactivez les sections publiques du site</p>
          <div className="mt-4 space-y-3">
            {verticals.map((v) => {
              const Icon = v.icon
              return (
                <div key={v.key} className="flex items-center justify-between rounded-[14px] border border-[#f3f3f3] p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ backgroundColor: `${v.color}1A` }}>
                      <Icon className="h-4 w-4" style={{ color: v.color }} strokeWidth={1.8} />
                    </div>
                    <p className="text-[13px] font-semibold text-[#222222]">{v.label}</p>
                  </div>
                  <Toggle checked={v.enabled} onChange={() => {}} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-2 text-[#222222]">
            <Globe className="h-4 w-4" />
            <h3 className="text-[15px] font-bold">Langue & région</h3>
          </div>
          <div className="mt-4 space-y-3 text-[13px] text-[#6a6a6a]">
            <div className="flex items-center justify-between">
              <span>Langue par défaut</span>
              <span className="font-semibold text-[#222222]">Français</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fuseau horaire</span>
              <span className="font-semibold text-[#222222]">Africa/Casablanca</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Format de date</span>
              <span className="font-semibold text-[#222222]">JJ/MM/AAAA</span>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#FECACA] bg-[#FEF2F2] p-5">
          <div className="flex items-center gap-2 text-[#DC2626]">
            <AlertTriangle className="h-4 w-4" />
            <h3 className="text-[15px] font-bold">Mode maintenance</h3>
          </div>
          <p className="mt-2 text-[12px] text-[#DC2626]/80">
            Active une page de maintenance pour tous les visiteurs du site public. Le back-office ModPass reste accessible.
          </p>
          <div className="mt-4">
            <Toggle checked={false} onChange={() => {}} label="Activer le mode maintenance" />
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const groups: { title: string; items: { label: string; description: string; defaultChecked: boolean }[] }[] = [
    {
      title: 'Modération',
      items: [
        { label: 'Nouveau signalement', description: 'Une annonce, un avis ou un profil est signalé', defaultChecked: true },
        { label: 'Avis en attente', description: "Un nouvel avis nécessite une vérification", defaultChecked: true },
      ],
    },
    {
      title: 'Annonces & produits',
      items: [
        { label: 'Nouvelle annonce immobilière', description: 'Publication en attente de validation', defaultChecked: true },
        { label: 'Nouveau produit ameublement', description: 'Produit ajouté par un vendeur', defaultChecked: false },
      ],
    },
    {
      title: 'Utilisateurs',
      items: [
        { label: 'Nouvelle inscription', description: 'Un nouvel utilisateur rejoint la plateforme', defaultChecked: false },
        { label: 'Compte suspendu', description: "Notification lors d'une suspension de compte", defaultChecked: true },
      ],
    },
    {
      title: 'Activité commerciale',
      items: [
        { label: 'Nouveau lead prestataire', description: 'Un client contacte un prestataire', defaultChecked: false },
        { label: 'Rapport hebdomadaire', description: 'Résumé des performances chaque lundi', defaultChecked: true },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {groups.map((group) => (
        <div key={group.title} className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">{group.title}</h3>
          <div className="mt-4 space-y-4">
            {group.items.map((item) => (
              <Toggle key={item.label} checked={item.defaultChecked} label={item.label} description={item.description} onChange={() => {}} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function SecuriteTab() {
  const sessions = [
    { id: 1, device: 'MacBook Pro · Chrome', location: 'Casablanca, Maroc', lastActive: '2026-06-15T08:30:00Z', current: true },
    { id: 2, device: 'iPhone 15 · Safari', location: 'Casablanca, Maroc', lastActive: '2026-06-14T19:10:00Z', current: false },
    { id: 3, device: 'Windows · Edge', location: 'Rabat, Maroc', lastActive: '2026-06-10T11:00:00Z', current: false },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-2 text-[#222222]">
            <KeyRound className="h-4 w-4" />
            <h3 className="text-[15px] font-bold">Mot de passe</h3>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Mot de passe actuel" defaultValue="" type="password" />
            <div />
            <Field label="Nouveau mot de passe" defaultValue="" type="password" />
            <Field label="Confirmer le mot de passe" defaultValue="" type="password" />
          </div>
          <div className="mt-5">
            <SaveButton />
          </div>
        </div>

        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Sessions actives</h3>
          <p className="mt-0.5 text-[12px] text-[#888888]">Appareils actuellement connectés à votre compte ModPass</p>
          <div className="mt-4 space-y-2">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between gap-3 rounded-[14px] border border-[#f3f3f3] p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#f7f7f7]">
                    {session.device.includes('iPhone') ? (
                      <Smartphone className="h-4 w-4 text-[#6a6a6a]" />
                    ) : (
                      <Laptop className="h-4 w-4 text-[#6a6a6a]" />
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#222222]">
                      {session.device} {session.current && <span className="text-[#16A34A]">· Session actuelle</span>}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[#888888]">
                      <MapPin className="h-3 w-3" /> {session.location} · {formatRelativeTime(session.lastActive)}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <button type="button" className="rounded-[8px] border border-[#dddddd] px-3 py-1.5 text-[12px] font-semibold text-[#DC2626] transition-colors hover:bg-[#FEF2F2]">
                    Déconnecter
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-2 text-[#222222]">
            <ShieldCheck className="h-4 w-4" />
            <h3 className="text-[15px] font-bold">Authentification ModPass</h3>
          </div>
          <div className="mt-4 space-y-4">
            <Toggle checked label="Double authentification" description="Code de sécurité envoyé par SMS à chaque connexion" onChange={() => {}} />
            <Toggle checked={false} label="Alertes de connexion" description="Email envoyé lors d'une nouvelle connexion" onChange={() => {}} />
          </div>
          <div className="mt-4 rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-3 text-[12px] text-[#888888]">
            Aperçu de design — aucune authentification réelle n&apos;est appliquée sur cet environnement.
          </div>
        </div>
      </div>
    </div>
  )
}

function EquipeTab() {
  const team = ADMIN_USERS.filter((u) => u.role === 'admin')

  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: 'name',
      header: 'Membre',
      sortValue: (u) => u.name,
      render: (u) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#222222]">{u.name}</p>
            <p className="truncate text-[12px] text-[#888888]">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      sortValue: (u) => u.role,
      render: () => (
        <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#FFFBEB] px-2 py-0.5 text-[11px] font-semibold text-[#B45309]">
          <ShieldCheck className="h-3 w-3" /> {ROLE_LABELS.admin}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      sortValue: (u) => u.status,
      render: (u) => <StatusPill label={u.status === 'actif' ? 'Actif' : u.status === 'en_attente' ? 'En attente' : 'Suspendu'} tone={USER_STATUS_TONES[u.status]} />,
    },
    {
      key: 'lastActiveAt',
      header: 'Dernière activité',
      sortValue: (u) => u.lastActiveAt,
      render: (u) => <span className="text-[13px] text-[#6a6a6a]">{formatRelativeTime(u.lastActiveAt)}</span>,
    },
    {
      key: 'joinedAt',
      header: "Membre depuis",
      sortValue: (u) => u.joinedAt,
      render: (u) => <span className="text-[13px] text-[#6a6a6a]">{formatDate(u.joinedAt)}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[#ebebeb] bg-white p-4">
        <div className="flex items-center gap-2 text-[13px] text-[#6a6a6a]">
          <User className="h-4 w-4 text-[#b0b0b0]" />
          {team.length} membre(s) avec un accès ModPass
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#222222] px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <UserPlus className="h-4 w-4" /> Inviter un membre
        </button>
      </div>

      <DataTable columns={columns} data={team} rowKey={(u) => u.id} pageSize={10} />

      <div className="flex items-center gap-2 rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] px-4 py-3 text-[12px] text-[#888888]">
        <Mail className="h-4 w-4" />
        <Phone className="h-4 w-4" />
        <Wallet className="h-4 w-4" />
        Aperçu de design — l&apos;invitation et la gestion des accès ne sont pas connectées à un service réel.
      </div>
    </div>
  )
}

export default function AdminParametresPage() {
  const [tab, setTab] = useState<Tab>('profil')

  return (
    <div className="space-y-5">
      <SectionHeader title="Paramètres" description="Gérez votre profil, la plateforme et les accès ModPass" />

      <TabNav tab={tab} setTab={setTab} />

      {tab === 'profil' && <ProfilTab />}
      {tab === 'plateforme' && <PlateformeTab />}
      {tab === 'notifications' && <NotificationsTab />}
      {tab === 'securite' && <SecuriteTab />}
      {tab === 'equipe' && <EquipeTab />}
    </div>
  )
}
