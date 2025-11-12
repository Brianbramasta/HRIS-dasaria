type MenuSection = "main";

type RolePolicy = {
  allowSections: Partial<Record<MenuSection, boolean>>;
  allowedPaths: "*" | string[];
};

const normalizeRole = (role?: string) => (role || "").trim().toLowerCase();

// Public paths are not guarded and always visible if routed publicly.
export const publicPaths: string[] = [
  "/data-karyawan/pendaftaran",
];

// Define policies per role. Add new roles here without changing components.
const policies: Record<string, RolePolicy> = {
  "hr/admin": {
    allowSections: { main: true },
    allowedPaths: "*",
  },
  staff: {
    allowSections: { main: true },
    allowedPaths: ["/data-karyawan","/pengunduran-diri"],
  },
};

// Default policy when role not found: allow all
const defaultPolicy: RolePolicy = {
  allowSections: { main: true },
  allowedPaths: "*",
};

export const getPolicyForRole = (role?: string): RolePolicy => {
  const key = normalizeRole(role);
  return policies[key] || defaultPolicy;
};

export const canAccessRoute = (role: string | undefined, path: string): boolean => {
  if (publicPaths.includes(path)) return true;
  const policy = getPolicyForRole(role);
  if (policy.allowedPaths === "*") return true;
  // Exact match policy; extend to prefixes if needed in future.
  return policy.allowedPaths.includes(path);
};

export const filterMenuByRole = <T extends { name: string; path?: string; subItems?: { name: string; path: string }[] }>(
  role: string | undefined,
  items: T[],
  section: MenuSection
): T[] => {
  const policy = getPolicyForRole(role);
  if (!policy.allowSections[section]) return [];

  if (policy.allowedPaths === "*") return items;

  return items
    .map((item) => {
      const allowedSubItems = (item.subItems || []).filter((si) => policy.allowedPaths.includes(si.path));
      const isItemPathAllowed = item.path ? policy.allowedPaths.includes(item.path) : false;
      if (allowedSubItems.length > 0 || isItemPathAllowed) {
        return { ...item, subItems: allowedSubItems } as T;
      }
      return null;
    })
    .filter(Boolean) as T[];
};