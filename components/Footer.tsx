export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl italic mb-2">The Colchonero</h3>
            <p className="text-sm text-white/70">
              Your go-to source for Atlético Madrid news, match coverage, squad updates, and club history.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm text-white/70">
              <li><a href="/news" className="hover:text-white transition-colors">News</a></li>
              <li><a href="/schedule" className="hover:text-white transition-colors">Schedule</a></li>
              <li><a href="/standings" className="hover:text-white transition-colors">Standings</a></li>
              <li><a href="/players" className="hover:text-white transition-colors">Squad</a></li>
              <li><a href="/history" className="hover:text-white transition-colors">History</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">About</h3>
            <p className="text-sm text-white/70">
              Independent Atlético Madrid news hub. Not affiliated with Club Atlético de Madrid.
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-6 pt-4 text-center text-sm text-white/60">
          © 2025 The Colchonero. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
