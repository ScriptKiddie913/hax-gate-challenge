{/* TEAM SECTION */}
<Card className="border border-[#335eff]/25 bg-[#0b1833]/55 backdrop-blur-2xl shadow-[0_0_32px_rgba(70,120,255,0.25)] hover:shadow-[0_0_45px_rgba(90,150,255,0.32)] transition-all duration-500">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-[#9ccaff]">
      <Users className="h-5 w-5 text-[#b5d4ff]" />
      Team
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-10 text-[#d9e3ff]/90 leading-relaxed">

    {/* MEMBER 1 */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#c7d8ff]">Sagnik</h3>

        <div className="flex gap-4">
          <a
            href="https://instagram.com/YOUR_INSTAGRAM"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:scale-110 drop-shadow-[0_0_10px_rgba(255,120,180,0.6)]"
          >
            <Instagram className="w-6 h-6 text-[#ff8fb7]" />
          </a>

          <a
            href="https://linkedin.com/in/YOUR_LINKEDIN"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:scale-110 drop-shadow-[0_0_10px_rgba(120,200,255,0.6)]"
          >
            <Linkedin className="w-6 h-6 text-[#8ecaff]" />
          </a>
        </div>
      </div>

      <p className="text-[#a8bfff]/90">
        Sagnik leads the development and construction of the SecureContainProtect CTF platform, 
        creating challenges and shaping the entire event ecosystem from structure to execution.
      </p>
    </div>

    {/* MEMBER 2 */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#c7d8ff]">Alpha</h3>

        <div className="flex gap-4">
          <a
            href="https://instagram.com/YOUR_INSTAGRAM"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:scale-110 drop-shadow-[0_0_10px_rgba(255,120,180,0.6)]"
          >
            <Instagram className="w-6 h-6 text-[#ff8fb7]" />
          </a>

          <a
            href="https://linkedin.com/in/YOUR_LINKEDIN"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:scale-110 drop-shadow-[0_0_10px_rgba(120,200,255,0.6)]"
          >
            <Linkedin className="w-6 h-6 text-[#8ecaff]" />
          </a>
        </div>
      </div>

      <p className="text-[#a8bfff]/90">
        Alpha manages infrastructure, backend systems, and deployment operations, ensuring 
        the CTF platform remains stable, reliable, and optimized at all times.
      </p>
    </div>

  </CardContent>
</Card>
