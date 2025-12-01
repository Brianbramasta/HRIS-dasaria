import EmployeeMetricCard from "../components/chart/EmployeeMetricCard";
import StatusKepegawaian from "../components/chart/StatusKepegawaian";
import Demographic from "../components/chart/Demographic";
import EmployeeEngagement from "../components/chart/EmployeeEngagement";
import Statistik from "../components/chart/Statistik";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top metrics and status section */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 md:gap-6 items-center">
        {/* Metrics grid */}
        <div className="xl:col-span-8">
          {(() => {
            const metrics = [
              {
                key: "active",
                title: "Pegawai Aktif",
                value: 250,
                icon: 
                <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_5453_61025)">
                    <path d="M21.6667 28.0833C21.6667 25.75 22.95 23.65 24.8167 22.6C23.3 22.0167 21.4333 21.6667 19.3333 21.6667C14.2 21.6667 10 23.7667 10 26.3333V28.6667H21.6667V28.0833ZM28.0833 24C25.8667 24 24 25.8667 24 28.0833C24 30.3 25.8667 32.1667 28.0833 32.1667C30.3 32.1667 32.1667 30.3 32.1667 28.0833C32.1667 25.8667 30.3 24 28.0833 24ZM24 14.6667C24 17.2333 21.9 19.3333 19.3333 19.3333C16.7667 19.3333 14.6667 17.2333 14.6667 14.6667C14.6667 12.1 16.7667 10 19.3333 10C21.9 10 24 12.1 24 14.6667Z" fill="#242425"/>
                    </g>
                    <defs>
                    <filter id="filter0_d_5453_61025" x="-2.91797" y="-2.9165" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset/>
                    <feGaussianBlur stdDeviation="5"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5453_61025"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5453_61025" result="shape"/>
                    </filter>
                    </defs>
                  </svg>
                      ,
              },
              {
                key: "inactive",
                title: "Pegawai Nonaktif",
                value: 250,
                icon: 
                <svg width="41" height="43" viewBox="0 0 41 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_5453_57308)">
                  <path d="M20.7567 10C21.9943 10 23.1813 10.4917 24.0565 11.3668C24.9317 12.242 25.4233 13.429 25.4233 14.6667C25.4233 16.9417 23.79 18.8433 21.6317 19.2517L16.1717 13.7917C16.3761 12.7253 16.9457 11.7634 17.7824 11.0715C18.6192 10.3795 19.6709 10.0006 20.7567 10ZM21.0833 21.6667L28.0833 28.6667L30.09 30.6733L28.6083 32.1667L25.1083 28.6667H11.4233V26.3333C11.4233 24.1867 14.34 22.3783 18.2717 21.83L10 13.5583L11.4817 12.0767L21.0833 21.6667ZM30.09 26.3333V27.71L24.42 22.04C27.7567 22.7517 30.09 24.4083 30.09 26.3333Z" fill="#242425"/>
                  </g>
                  <defs>
                  <filter id="filter0_d_5453_57308" x="-3.95312" y="-2.9165" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="5"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5453_57308"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5453_57308" result="shape"/>
                  </filter>
                  </defs> 
                </svg>,
              },
              {
                key: "garden",
                title: "Mengundurkan Diri",
                value: 250,
                icon: 
                <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_5453_61033)">
                  <path d="M14.6667 14.6667C14.6667 12.0883 16.755 10 19.3333 10C21.9117 10 24 12.0883 24 14.6667C24 17.245 21.9117 19.3333 19.3333 19.3333C16.755 19.3333 14.6667 17.245 14.6667 14.6667ZM21.6667 26.5667C21.6667 25.4467 22.25 24.3967 23.0667 23.6967V23.4167C23.0667 22.9617 23.1483 22.53 23.2767 22.11C22.075 21.83 20.745 21.6667 19.3333 21.6667C14.1767 21.6667 10 23.755 10 26.3333V28.6667H21.6667V26.5667ZM33.3333 26.6833V30.7667C33.3333 31.4667 32.6333 32.1667 31.8167 32.1667H25.4C24.7 32.1667 24 31.4667 24 30.65V26.5667C24 25.8667 24.7 25.1667 25.4 25.1667V23.4167C25.4 21.7833 27.0333 20.5 28.6667 20.5C30.3 20.5 31.9333 21.7833 31.9333 23.4167V25.1667C32.6333 25.1667 33.3333 25.8667 33.3333 26.6833ZM30.4167 23.4167C30.4167 22.4833 29.6 21.9 28.6667 21.9C27.7333 21.9 26.9167 22.4833 26.9167 23.4167V25.1667H30.4167V23.4167Z" fill="#242425"/>
                  </g>
                  <defs>
                  <filter id="filter0_d_5453_61033" x="-2.33203" y="-2.9165" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="5"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5453_61033"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5453_61033" result="shape"/>
                  </filter>
                  </defs>
                  </svg>,
              },
              {
                key: "onboarding",
                title: "Pegawai dalam Orientasi",
                value: 250,
                icon: 
                <svg width="46" height="39" viewBox="0 0 46 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_5453_61074)">
                  <path d="M26.3333 21.6667C23.2183 21.6667 17 23.2183 17 26.3333V28.6667H35.6667V26.3333C35.6667 23.2183 29.4483 21.6667 26.3333 21.6667ZM15.8333 17V13.5H13.5V17H10V19.3333H13.5V22.8333H15.8333V19.3333H19.3333V17M26.3333 19.3333C27.571 19.3333 28.758 18.8417 29.6332 17.9665C30.5083 17.0913 31 15.9043 31 14.6667C31 13.429 30.5083 12.242 29.6332 11.3668C28.758 10.4917 27.571 10 26.3333 10C25.0957 10 23.9087 10.4917 23.0335 11.3668C22.1583 12.242 21.6667 13.429 21.6667 14.6667C21.6667 15.9043 22.1583 17.0913 23.0335 17.9665C23.9087 18.8417 25.0957 19.3333 26.3333 19.3333Z" fill="#242425"/>
                  </g>
                  <defs>
                  <filter id="filter0_d_5453_61074" x="-1.16797" y="-4.6665" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="5"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5453_61074"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5453_61074" result="shape"/>
                  </filter>
                  </defs>
                  </svg>,
              },
            ];
            return (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                {metrics.map((m) => (
                  <EmployeeMetricCard key={m.key} title={m.title} value={m.value} icon={m.icon} />
                ))}
              </div>
            );
          })()}
        </div>

        {/* Status Kepegawaian (donut) */}
        <div className="xl:col-span-4">
          <StatusKepegawaian />
        </div>
      </div>

      {/* Demographic and Engagement */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 md:gap-6">
        <div className="xl:col-span-8">
          <Demographic />
        </div>
        <div className="xl:col-span-4">
          <EmployeeEngagement />
        </div>
      </div>

      {/* Statistik */}
      <div>
        <Statistik />
      </div>
    </div>
  );
}